#!/usr/bin/env python3
"""Build the Virge Google Slides theme and logo files into public/styleguide/.

Google Slides has no theme file of its own: themes are imported from a .pptx.
This writes that .pptx by hand (a zip of OOXML) because it needs two real slide
masters, "Virge Dark" and "Virge Light", each with its own colour scheme.

Run from anywhere (needs Pillow and numpy):

    python3 scripts/styleguide/build_slides_theme.py

Colours come from src/styles/global.css and WebinarSocialCard.astro. The site is
dark only, so the light palette is derived from it.
"""
from __future__ import annotations

import io
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "styleguide"
PPTX = OUT / "slides" / "virge-slides-theme.pptx"

EMU = 914400
W, H = 10.0, 5.625  # Google Slides' own 16:9 page, so imports are not rescaled
LOGO_RATIO = 642 / 475
HEAD_FONT = BODY_FONT = "Inter"  # closest Google Font to the site's system stack
CODE_FONT = "JetBrains Mono"

# On purpose the dark scheme stores its light text colour in dk1 and its dark
# background in lt1. With the standard bg1=lt1 / tx1=dk1 mapping the colours are
# right whether or not an importer honours a swapped colour map.
SCHEMES = {
    "dark": {
        "name": "Virge Dark",
        "dk1": "FFFFFF", "lt1": "0A0A1A", "dk2": "E0E0F0", "lt2": "12122A",
        "accent1": "6C5CE7", "accent2": "A855F7", "accent3": "5CB8FF",
        "accent4": "E879F9", "accent5": "C4A5FF", "accent6": "29B6F6",
        "hlink": "C4A5FF", "folHlink": "A1A1C4",
    },
    "light": {
        "name": "Virge Light",
        "dk1": "0A0A1A", "lt1": "FFFFFF", "dk2": "2A2A4A", "lt2": "F3F2FB",
        "accent1": "6C5CE7", "accent2": "A855F7", "accent3": "1565C0",
        "accent4": "C026D3", "accent5": "5B3FD6", "accent6": "29B6F6",
        "hlink": "5B3FD6", "folHlink": "55557A",
    },
}
MUTED = {"dark": "A1A1C4", "light": "55557A"}
BUTTON = "9D4EDD"  # --accent-btn: white text on it clears AA
GRADIENT = ("6C5CE7", "A855F7")  # --gradient
WFO, SHOPVIRGE = "accent3", "accent4"  # banner colours per product

NS = (
    'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
    'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"'
)
XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"


def emu(inches: float) -> int:
    return round(inches * EMU)


# --- Images -----------------------------------------------------------------


def background(mode: str, accent: str | None, glow: float) -> bytes:
    """The social banner backdrop: two corner glows over a faint 40px grid."""
    w, h = 1920, 1080
    base = np.array(hex_rgb(SCHEMES[mode]["lt1"]), dtype=np.float32)
    img = np.broadcast_to(base, (h, w, 3)).copy()
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)

    def add_glow(cx, cy, rx, ry, colour, alpha):
        t = np.sqrt(((xs - cx) / rx) ** 2 + ((ys - cy) / ry) ** 2) / 0.7
        t = np.clip(1 - t, 0, 1)
        mask = (alpha * t * t * (3 - 2 * t))[..., None]
        img[:] = img * (1 - mask) + np.array(hex_rgb(colour), dtype=np.float32) * mask

    strength = glow * (1 if mode == "dark" else 0.55)
    if accent:
        add_glow(w, 0, 960, 672, accent, 0.40 * strength)
    add_glow(0, h, 1120, 768, "6C5CE7", 0.38 * strength)

    line = 255.0 if mode == "dark" else 40.0
    grid = np.zeros((h, w), dtype=np.float32)
    grid[::64, :] = grid[:, ::64] = 0.035 * (0.5 + 0.5 * min(glow, 1))
    img[:] = img * (1 - grid[..., None]) + line * grid[..., None]

    # Noise instead of banding: dark gradients band badly on a shared screen.
    noise = np.random.default_rng(7).uniform(-0.8, 0.8, (h, w, 1))
    out = np.clip(img + noise, 0, 255).astype(np.uint8)
    buf = io.BytesIO()
    Image.fromarray(out).save(buf, "JPEG", quality=88, subsampling=0, optimize=True)
    return buf.getvalue()


def hex_rgb(value: str) -> tuple[int, int, int]:
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def png(image: Image.Image) -> bytes:
    buf = io.BytesIO()
    image.save(buf, "PNG", optimize=True)
    return buf.getvalue()


def logos() -> dict[str, bytes]:
    """Logo variants from public/logo.png, whose wordmark is white."""
    source = Image.open(ROOT / "public" / "logo.png").convert("RGBA")
    on_light = np.array(source)
    on_light[379:, :, :3] = hex_rgb(SCHEMES["dark"]["lt1"])  # rows 379+ hold the wordmark
    mark = source.crop((0, 0, source.width, 280))
    return {
        "virge-logo-on-dark.png": png(source),
        "virge-logo-on-light.png": png(Image.fromarray(on_light)),
        "virge-mark.png": png(mark.crop(mark.getbbox())),
    }


# --- Shape helpers ----------------------------------------------------------


class Ids:
    """Shape ids must be unique within a part."""

    def __init__(self):
        self.n = 1

    def __call__(self) -> int:
        self.n += 1
        return self.n


def xfrm(box) -> str:
    x, y, w, h = box
    return (
        f'<a:xfrm><a:off x="{emu(x)}" y="{emu(y)}"/>'
        f'<a:ext cx="{emu(w)}" cy="{emu(h)}"/></a:xfrm>'
    )


def scheme(name: str) -> str:
    return f'<a:solidFill><a:schemeClr val="{name}"/></a:solidFill>'


def rgb(value: str) -> str:
    return f'<a:solidFill><a:srgbClr val="{value}"/></a:solidFill>'


def gradient_fill() -> str:
    return (
        f'<a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:srgbClr val="{GRADIENT[0]}"/></a:gs>'
        f'<a:gs pos="100000"><a:srgbClr val="{GRADIENT[1]}"/></a:gs></a:gsLst>'
        '<a:lin ang="2700000" scaled="0"/></a:gradFill>'
    )


def lvl(n=1, size=None, fill=None, bold=None, bullet=None, font=None, mar=0, indent=0,
        spc_before=None, spc=None, cap=False, align=None, line=None) -> str:
    """One <a:lvlNpPr>. `bullet` is None (inherit), "none", "num" or a character."""
    attrs = f'marL="{emu(mar)}" indent="{emu(indent)}"'
    if align:
        attrs += f' algn="{align}"'
    inner = ""
    if line:
        inner += f'<a:lnSpc><a:spcPct val="{line * 1000}"/></a:lnSpc>'
    if spc_before is not None:
        inner += f'<a:spcBef><a:spcPts val="{spc_before * 100}"/></a:spcBef>'
    if bullet == "none":
        inner += "<a:buNone/>"
    elif bullet == "num":
        inner += f'<a:buClr><a:schemeClr val="accent5"/></a:buClr><a:buFont typeface="{BODY_FONT}"/>'
        inner += '<a:buAutoNum type="arabicPeriod"/>'
    elif bullet:
        inner += f'<a:buClr><a:schemeClr val="accent5"/></a:buClr><a:buChar char="{bullet}"/>'
    r = ""
    if size:
        r += f' sz="{size * 100}"'
    if bold is not None:
        r += f' b="{int(bold)}"'
    if cap:
        r += ' cap="all"'
    if spc:
        r += f' spc="{spc}"'
    body = (fill or "") + (
        f'<a:latin typeface="{font}"/><a:cs typeface="{font}"/>' if font else ""
    )
    return f"<a:lvl{n}pPr {attrs}>{inner}<a:defRPr{r}>{body}</a:defRPr></a:lvl{n}pPr>"


def paragraphs(text) -> str:
    """A string or list of strings; (level, text) tuples set the indent level."""
    items = text if isinstance(text, list) else [text]
    out = ""
    for item in items:
        level, line = item if isinstance(item, tuple) else (0, item)
        ppr = f'<a:pPr lvl="{level}"/>' if level else ""
        out += f'<a:p>{ppr}<a:r><a:rPr lang="en-US"/><a:t>{escape(line)}</a:t></a:r></a:p>'
    return out


def placeholder(sid, name, ph_attrs, box=None, lst="", text="Click to edit", body_pr="<a:bodyPr/>",
                geom=None, fill=None) -> str:
    sppr = (xfrm(box) if box else "") + (
        f'<a:prstGeom prst="{geom}"><a:avLst/></a:prstGeom>' if geom else ""
    ) + (fill or "")
    txt = f"<a:lstStyle>{lst}</a:lstStyle>" if lst else "<a:lstStyle/>"
    return (
        f'<p:sp><p:nvSpPr><p:cNvPr id="{sid}" name="{escape(name)}"/>'
        f'<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph {ph_attrs}/></p:nvPr></p:nvSpPr>'
        f"<p:spPr>{sppr}</p:spPr><p:txBody>{body_pr}{txt}{paragraphs(text)}</p:txBody></p:sp>"
    )


def picture_ph(sid, name, idx, box, geom="rect", prompt="Add a picture") -> str:
    return (
        f'<p:sp><p:nvSpPr><p:cNvPr id="{sid}" name="{escape(name)}"/>'
        f'<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="pic" idx="{idx}"/></p:nvPr></p:nvSpPr>'
        f'<p:spPr>{xfrm(box)}<a:prstGeom prst="{geom}"><a:avLst/></a:prstGeom>{scheme("bg2")}</p:spPr>'
        f"<p:txBody><a:bodyPr/><a:lstStyle/>{paragraphs(prompt)}</p:txBody></p:sp>"
    )


def slide_number(sid, box=None, lst="") -> str:
    sppr = xfrm(box) if box else ""
    txt = f"<a:lstStyle>{lst}</a:lstStyle>" if lst else "<a:lstStyle/>"
    return (
        f'<p:sp><p:nvSpPr><p:cNvPr id="{sid}" name="Slide number"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>'
        f'<p:nvPr><p:ph type="sldNum" sz="quarter" idx="12"/></p:nvPr></p:nvSpPr><p:spPr>{sppr}</p:spPr>'
        f'<p:txBody><a:bodyPr/>{txt}<a:p><a:fld id="{{B6F15528-21DE-4FAA-801E-634DDDAF4B2B}}" type="slidenum">'
        '<a:rPr lang="en-US"/><a:t>‹#›</a:t></a:fld></a:p></p:txBody></p:sp>'
    )


def picture(sid, name, rid, box) -> str:
    return (
        f'<p:pic><p:nvPicPr><p:cNvPr id="{sid}" name="{name}" descr="{name}"/>'
        '<p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr userDrawn="1"/></p:nvPicPr>'
        f'<p:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>'
        f'<p:spPr>{xfrm(box)}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>'
    )


def shape(sid, name, box, geom, fill, text="", attrs="", colour="", algn="ctr", anchor="ctr", radius=None) -> str:
    av = f'<a:avLst><a:gd name="adj" fmla="val {radius}"/></a:avLst>' if radius else "<a:avLst/>"
    run = f'<a:r><a:rPr lang="en-US"{attrs}>{colour}</a:rPr><a:t>{escape(text)}</a:t></a:r>' if text else ""
    return (
        f'<p:sp><p:nvSpPr><p:cNvPr id="{sid}" name="{escape(name)}"/><p:cNvSpPr/><p:nvPr userDrawn="1"/></p:nvSpPr>'
        f'<p:spPr>{xfrm(box)}<a:prstGeom prst="{geom}">{av}</a:prstGeom>{fill}<a:ln><a:noFill/></a:ln></p:spPr>'
        f'<p:txBody><a:bodyPr rtlCol="0" anchor="{anchor}"/><a:lstStyle/>'
        f'<a:p><a:pPr algn="{algn}"/>{run}</a:p></p:txBody></p:sp>'
    )


def text_box(sid, name, box, text, size, fill) -> str:
    return (
        f'<p:sp><p:nvSpPr><p:cNvPr id="{sid}" name="{name}"/><p:cNvSpPr txBox="1"/><p:nvPr userDrawn="1"/></p:nvSpPr>'
        f'<p:spPr>{xfrm(box)}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>'
        f'<p:txBody><a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"/><a:lstStyle/>'
        f'<a:p><a:r><a:rPr lang="en-US" sz="{size * 100}">{fill}</a:rPr><a:t>{escape(text)}</a:t></a:r></a:p></p:txBody></p:sp>'
    )


def tree(shapes: str) -> str:
    return (
        '<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
        '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
        f"{shapes}</p:spTree>"
    )


def bg_image(rid: str) -> str:
    return (
        f'<p:bg><p:bgPr><a:blipFill dpi="0" rotWithShape="1"><a:blip r:embed="{rid}"/><a:srcRect/>'
        "<a:stretch><a:fillRect/></a:stretch></a:blipFill><a:effectLst/></p:bgPr></p:bg>"
    )


# --- Layouts ----------------------------------------------------------------

TOP = 'lIns="0" tIns="0" rIns="0" bIns="0" anchor="t"'
BOTTOM = 'lIns="0" tIns="0" rIns="0" bIns="0" anchor="b"'
FLUSH = f"<a:bodyPr {TOP}><a:noAutofit/></a:bodyPr>"
FLUSH_BOTTOM = f"<a:bodyPr {BOTTOM}><a:noAutofit/></a:bodyPr>"


def eyebrow_style(colour="accent5"):
    return lvl(size=11, fill=scheme(colour), bold=True, bullet="none", spc=150, cap=True)


def plain_style(size, fill, bold=False):
    return lvl(size=size, fill=fill, bold=bold, bullet="none")


def build_layouts(mode: str) -> list[dict]:
    """Each layout: name, type, background key, whether it uses the master's footer, shapes."""
    muted = rgb(MUTED[mode])
    logo = f"images/logo-{mode}"

    def cover(name, accent, bg):
        def shapes(i, img):
            return (
                picture(i(), "Virge logo", img(logo), (0.5, 0.42, 0.72 * LOGO_RATIO, 0.72))
                + placeholder(i(), "Eyebrow", 'type="body" sz="quarter" idx="10"', (0.5, 1.55, 9.0, 0.28),
                              eyebrow_style(accent), "Product · Webinar", FLUSH)
                + placeholder(i(), "Title", 'type="ctrTitle"', (0.5, 1.88, 8.8, 1.3),
                              lvl(size=36, fill=scheme("tx1"), bold=True, bullet="none", line=95, align="l"),
                              "Webinar title", FLUSH)
                + placeholder(i(), "Subtitle", 'type="subTitle" idx="1"', (0.5, 3.25, 8.2, 0.8),
                              plain_style(15, scheme("tx2")), "One sentence on what people will learn", FLUSH)
                + placeholder(i(), "Date and speakers", 'type="body" sz="quarter" idx="11"', (0.5, 4.6, 9.0, 0.3),
                              plain_style(12, muted), "Date · Speakers · virge.io", FLUSH)
            )
        return dict(name=name, type="title", bg=bg, footer=False, shapes=shapes)

    def section(i, img):
        return (
            placeholder(i(), "Eyebrow", 'type="body" sz="quarter" idx="10"', (0.5, 0.5, 9.0, 0.28),
                        eyebrow_style(), "Part 1", FLUSH)
            + placeholder(i(), "Title", 'type="title"', (0.5, 1.4, 9.0, 1.3),
                          lvl(size=34, bold=True, bullet="none", line=95), "Section title", FLUSH_BOTTOM)
            + placeholder(i(), "Description", 'type="body" idx="1"', (0.5, 2.82, 7.6, 0.8),
                          plain_style(15, scheme("tx2")), "What this part covers", FLUSH)
            + slide_number(i())
        )

    def content(i, img):
        return (placeholder(i(), "Title", 'type="title"', None, "", "Slide title")
                + placeholder(i(), "Content", 'idx="1"', None, "", "Click to add text")
                + slide_number(i()))

    def two_columns(i, img):
        return (
            shape(i(), "Left card", (0.5, 1.2, 4.4, 3.72), "roundRect", scheme("bg2"), radius=3000)
            + shape(i(), "Right card", (5.1, 1.2, 4.4, 3.72), "roundRect", scheme("bg2"), radius=3000)
            + placeholder(i(), "Title", 'type="title"', None, "", "Slide title")
            + placeholder(i(), "Left", 'sz="half" idx="1"', (0.72, 1.4, 3.96, 3.32), "", "Left column", FLUSH)
            + placeholder(i(), "Right", 'sz="half" idx="2"', (5.32, 1.4, 3.96, 3.32), "", "Right column", FLUSH)
            + slide_number(i())
        )

    def only_title(i, img):
        return placeholder(i(), "Title", 'type="title"', None, "", "Slide title") + slide_number(i())

    def statement(i, img):
        return (
            placeholder(i(), "Statement", 'type="title"', (0.9, 1.2, 8.2, 2.3),
                        lvl(size=30, bold=True, bullet="none", line=100), "One big idea", FLUSH_BOTTOM)
            + placeholder(i(), "Attribution", 'type="body" idx="1"', (0.9, 3.65, 8.2, 0.6),
                          plain_style(14, muted), "Who said it, or why it matters", FLUSH)
            + slide_number(i())
        )

    def code(i, img):
        return (
            shape(i(), "Code card", (0.5, 1.2, 9.0, 3.72), "roundRect", scheme("bg2"), radius=3000)
            + placeholder(i(), "Title", 'type="title"', None, "", "Slide title")
            + placeholder(i(), "Code", 'type="body" idx="1"', (0.72, 1.4, 8.56, 3.32),
                          lvl(size=12, fill=scheme("tx2"), bullet="none", font=CODE_FONT, spc_before=0, line=110)
                          + "".join(lvl(n, size=12, fill=scheme("tx2"), bullet="none", font=CODE_FONT,
                                        spc_before=0, line=110, mar=0.25 * (n - 1)) for n in (2, 3)),
                          "code goes here", FLUSH)
            + slide_number(i())
        )

    def screenshot(i, img):
        return (
            placeholder(i(), "Title", 'type="title"', None, "", "Slide title")
            + picture_ph(i(), "Screenshot", 13, (0.5, 1.2, 9.0, 3.4), prompt="Add a screenshot")
            + placeholder(i(), "Caption", 'type="body" sz="quarter" idx="1"', (0.5, 4.68, 9.0, 0.28),
                          plain_style(10, muted), "Caption", FLUSH)
            + slide_number(i())
        )

    def speakers(i, img):
        out = placeholder(i(), "Title", 'type="title"', None, "", "Your speakers")
        for n, x in enumerate((0.5, 3.6, 6.7)):
            out += picture_ph(i(), f"Speaker {n + 1} photo", 13 + n, (x, 1.45, 1.3, 1.3), "ellipse", "Photo")
            out += placeholder(i(), f"Speaker {n + 1}", f'type="body" sz="quarter" idx="{10 + n}"', (x, 2.95, 2.75, 1.2),
                               lvl(size=15, fill=scheme("tx1"), bold=True, bullet="none")
                               + lvl(2, size=12, fill=muted, bold=False, bullet="none", spc_before=3),
                               ["Name", (1, "Role")], FLUSH)
        return out + slide_number(i())

    def agenda(i, img):
        return (
            placeholder(i(), "Title", 'type="title"', (0.5, 0.42, 3.0, 1.0), "", "Agenda")
            + placeholder(i(), "Agenda items", 'type="body" idx="1"', (3.7, 0.5, 5.8, 4.35),
                          lvl(size=17, fill=scheme("tx2"), bullet="num", mar=0.42, indent=-0.42, spc_before=18),
                          ["First topic", "Second topic", "Third topic"], FLUSH)
            + slide_number(i())
        )

    def closing(i, img):
        return (
            picture(i(), "Virge logo", img(logo), (0.5, 0.42, 0.72 * LOGO_RATIO, 0.72))
            + placeholder(i(), "Title", 'type="title"', (0.5, 1.75, 9.0, 0.95),
                          lvl(size=36, bold=True, bullet="none"), "Thanks for joining", FLUSH)
            + placeholder(i(), "Next steps", 'type="body" idx="1"', (0.5, 2.75, 7.6, 1.1),
                          plain_style(15, scheme("tx2")), "Where to go next", FLUSH)
            + placeholder(i(), "Call to action", 'type="body" sz="quarter" idx="10"', (0.5, 4.05, 2.6, 0.5),
                          lvl(size=14, fill=rgb("FFFFFF"), bold=True, bullet="none", align="ctr"), "virge.io",
                          '<a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"><a:noAutofit/></a:bodyPr>',
                          geom="roundRect", fill=rgb(BUTTON))
        )

    def blank(i, img):
        return slide_number(i())

    return [
        cover("Cover · Workflow Orchestrator", WFO, "cover-wfo"),
        cover("Cover · ShopVirge", SHOPVIRGE, "cover-shopvirge"),
        dict(name="Agenda", type="obj", bg=None, footer=True, shapes=agenda),
        dict(name="Section", type="secHead", bg="section", footer=True, shapes=section),
        dict(name="Title and content", type="obj", bg=None, footer=True, shapes=content),
        dict(name="Two columns", type="twoObj", bg=None, footer=True, shapes=two_columns),
        dict(name="Title only", type="titleOnly", bg=None, footer=True, shapes=only_title),
        dict(name="Statement", type="titleOnly", bg="section", footer=True, shapes=statement),
        dict(name="Code", type="obj", bg=None, footer=True, shapes=code),
        dict(name="Screenshot", type="picTx", bg=None, footer=True, shapes=screenshot),
        dict(name="Speakers", type="titleOnly", bg=None, footer=True, shapes=speakers),
        dict(name="Closing", type="obj", bg="section", footer=False, shapes=closing),
        dict(name="Blank", type="blank", bg=None, footer=True, shapes=blank),
    ]


def theme_xml(mode: str) -> str:
    s = SCHEMES[mode]
    colours = "".join(
        f'<a:{k}><a:srgbClr val="{s[k]}"/></a:{k}>'
        for k in ("dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3",
                  "accent4", "accent5", "accent6", "hlink", "folHlink")
    )
    ln = "".join(
        f'<a:ln w="{w}"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>' for w in (6350, 12700, 19050)
    )
    fill = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'
    return (
        f'{XML}<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="{s["name"]}">'
        f'<a:themeElements><a:clrScheme name="{s["name"]}">{colours}</a:clrScheme>'
        f'<a:fontScheme name="Virge"><a:majorFont><a:latin typeface="{HEAD_FONT}"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont>'
        f'<a:minorFont><a:latin typeface="{BODY_FONT}"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme>'
        f'<a:fmtScheme name="Virge"><a:fillStyleLst>{fill * 3}</a:fillStyleLst><a:lnStyleLst>{ln}</a:lnStyleLst>'
        '<a:effectStyleLst>' + "<a:effectStyle><a:effectLst/></a:effectStyle>" * 3 + "</a:effectStyleLst>"
        f"<a:bgFillStyleLst>{fill * 3}</a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>"
    )


def master_xml(mode: str, layout_ids: list[tuple[int, str]], bg_rid: str, mark_rid: str) -> str:
    i = Ids()
    muted = rgb(MUTED[mode])
    mark_w = 0.3
    mark_h = mark_w / MARK_RATIO
    shapes = (
        placeholder(i(), "Title", 'type="title"', (0.5, 0.42, 9.0, 0.75), "", "Slide title", FLUSH)
        + placeholder(i(), "Content", 'type="body" idx="1"', (0.5, 1.3, 9.0, 3.55), "",
                      ["First level", (1, "Second level"), (2, "Third level")], FLUSH)
        + picture(i(), "Virge mark", mark_rid, (0.5, 5.2 - mark_h / 2, mark_w, mark_h))
        + text_box(i(), "Website", (0.87, 5.08, 2.0, 0.24), "virge.io", 9, muted)
        + slide_number(
            i(), (8.5, 5.08, 1.0, 0.24),
            lvl(size=9, fill=muted, bullet="none", align="r", font="+mn-lt"))
    )
    ids = "".join(f'<p:sldLayoutId id="{n}" r:id="{r}"/>' for n, r in layout_ids)
    title_style = lvl(size=26, fill=scheme("tx1"), bold=True, bullet="none", font="+mj-lt", line=95, align="l")
    body_style = (
        lvl(size=16, fill=scheme("tx2"), bullet="•", font="+mn-lt", mar=0.25, indent=-0.25, spc_before=8)
        + lvl(2, size=14, fill=scheme("tx2"), bullet="–", font="+mn-lt", mar=0.5, indent=-0.22, spc_before=4)
        + lvl(3, size=12, fill=muted, bullet="•", font="+mn-lt", mar=0.75, indent=-0.2, spc_before=3)
    )
    other = lvl(size=14, fill=scheme("tx1"), font="+mn-lt")
    return (
        f'{XML}<p:sldMaster {NS}><p:cSld>{bg_image(bg_rid)}{tree(shapes)}</p:cSld>'
        '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" '
        'accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>'
        f"<p:sldLayoutIdLst>{ids}</p:sldLayoutIdLst>"
        f"<p:txStyles><p:titleStyle>{title_style}</p:titleStyle>"
        f"<p:bodyStyle>{body_style}</p:bodyStyle><p:otherStyle>{other}</p:otherStyle></p:txStyles></p:sldMaster>"
    )


# --- Sample slides (one per layout, using the next real webinar) ------------


def sample_slides(mode: str) -> list[dict]:
    label = mode.title()
    wfo_title = "Agent based network troubleshooting with the WFO"
    return [
        dict(layout="Cover · Workflow Orchestrator", fill={
            'type="body" sz="quarter" idx="10"': "WORKFLOW ORCHESTRATOR · WEBINAR",
            'type="ctrTitle"': wfo_title,
            'type="subTitle" idx="1"': "How a team of AI agents, connected to the Workflow Orchestrator and Netbox through MCP, diagnoses real network problems.",
            'type="body" sz="quarter" idx="11"': "11 November 2026 · Tim Frohlich & René Dohmen · virge.io",
        }),
        dict(layout="Cover · ShopVirge", fill={
            'type="body" sz="quarter" idx="10"': "SHOPVIRGE · WEBINAR",
            'type="ctrTitle"': "Automatic webshop content generation at scale with ShopVirge",
            'type="subTitle" idx="1"': "The pink accent marks ShopVirge webinars, the blue one Workflow Orchestrator.",
            'type="body" sz="quarter" idx="11"': "Date · Speakers · virge.io",
        }),
        dict(layout="Agenda", fill={
            'type="title"': "Agenda",
            'type="body" idx="1"': [
                "What an agent really is",
                "MCP servers for the WFO",
                "Where to run agents",
                "Agent-to-agent collaboration",
                "Live demo with WFO and Netbox",
                "Risks, evals and what is next",
            ],
        }),
        dict(layout="Section", fill={
            'type="body" sz="quarter" idx="10"': "PART 1",
            'type="title"': "What an agent really is",
            'type="body" idx="1"': "A system prompt, a model of choice and a specified set of MCP tools.",
        }),
        dict(layout="Title and content", fill={
            'type="title"': "An agent is three things",
            'idx="1"': [
                "A system prompt that defines its job",
                "A model of your choice",
                "A specified set of MCP tools",
                (1, "Workflow Orchestrator and Netbox for context"),
                (2, "Network tools for the actual checks"),
            ],
        }),
        dict(layout="Two columns", fill={
            'type="title"': "Where to run your agents",
            'sz="half" idx="1"': ["kagent on Kubernetes", "Docker Agent"],
            'sz="half" idx="2"': ["LibreChat", "Slack"],
        }),
        dict(layout="Title only", fill={'type="title"': "Title only, for your own diagram or chart"}),
        dict(layout="Statement", fill={
            'type="title"': "Letting specialised agents collaborate on one incident",
            'type="body" idx="1"': "Agent-to-agent (A2A)",
        }),
        dict(layout="Code", fill={
            'type="title"': "A minimal MCP tool",
            'type="body" idx="1"': [
                "from fastmcp import FastMCP",
                " ",
                'mcp = FastMCP("wfo")',
                " ",
                "@mcp.tool()",
                "def get_subscription(subscription_id: str) -> dict:",
                (1, '"""Look up a subscription in the orchestrator."""'),
                (1, "return wfo_client.subscription(subscription_id)"),
            ],
        }),
        dict(layout="Screenshot", fill={
            'type="body" sz="quarter" idx="1"': "Caption for your screenshot",
            'type="title"': "Live demo",
        }, extra="screenshot"),
        dict(layout="Speakers", fill={
            'type="title"': "Your speakers",
            'type="body" sz="quarter" idx="10"': ["Tim Frohlich", (1, "ML/AI specialist")],
            'type="body" sz="quarter" idx="11"': ["René Dohmen", (1, "Fullstack Python Engineer")],
        }, extra="speakers"),
        dict(layout="Closing", fill={
            'type="title"': "Thanks for joining",
            'type="body" idx="1"': "See what is next at virge.io/en/webinars/",
            'type="body" sz="quarter" idx="10"': "virge.io",
        }),
        dict(layout="Blank", fill={}, extra="note", note=f"Blank · {label}"),
    ]


def slide_xml(sample: dict, mode: str) -> str:
    i = Ids()
    body = ""
    for n, (attrs, text) in enumerate(sample["fill"].items()):
        body += placeholder(i(), f"Placeholder {n + 1}", attrs, None, "", text, "<a:bodyPr/>")
    extra = sample.get("extra")
    if extra == "speakers":
        for n, initials in enumerate(("TF", "RD")):
            x = (0.5, 3.6)[n]
            body += shape(i(), f"Avatar {n + 1}", (x, 1.45, 1.3, 1.3), "ellipse", gradient_fill(), initials,
                          ' sz="2800" b="1"', rgb("FFFFFF"))
    if extra == "screenshot":
        body += shape(i(), "Screenshot stand-in", (0.5, 1.2, 9.0, 3.4), "roundRect", scheme("bg2"),
                      "Your screenshot", ' sz="1600"', rgb(MUTED[mode]), radius=3000)
    if sample["layout"] not in ("Cover · Workflow Orchestrator", "Cover · ShopVirge", "Closing"):
        body += slide_number(i())
    body = body.replace('<p:nvPr userDrawn="1"/>', "<p:nvPr/>")
    return (
        f'{XML}<p:sld {NS}><p:cSld>{tree(body)}</p:cSld>'
        "<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>"
    )


# --- Package ----------------------------------------------------------------


def rels(items: list[tuple[str, str, str]]) -> str:
    body = "".join(f'<Relationship Id="{i}" Type="{REL}/{t}" Target="{target}"/>' for i, t, target in items)
    return f'{XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">{body}</Relationships>'


def build() -> None:
    global MARK_RATIO
    logo_files = logos()
    OUT.joinpath("logo").mkdir(parents=True, exist_ok=True)
    PPTX.parent.mkdir(parents=True, exist_ok=True)
    for name, data in logo_files.items():
        OUT.joinpath("logo", name).write_bytes(data)
    mark = Image.open(io.BytesIO(logo_files["virge-mark.png"]))
    MARK_RATIO = mark.width / mark.height

    media: dict[str, bytes] = {
        "mark.png": logo_files["virge-mark.png"],
        "logo-dark.png": logo_files["virge-logo-on-dark.png"],
        "logo-light.png": logo_files["virge-logo-on-light.png"],
    }
    bg_recipes = {
        "content": (None, 0.28),
        "section": ("29B6F6", 1.0),
        "cover-wfo": ("5CB8FF", 1.0),
        "cover-shopvirge": ("E879F9", 1.0),
    }
    for mode in SCHEMES:
        for key, (accent, glow) in bg_recipes.items():
            media[f"bg-{mode}-{key}.jpg"] = background(mode, accent, glow)

    files: dict[str, bytes | str] = {}
    overrides: list[tuple[str, str]] = []
    pres_rels: list[tuple[str, str, str]] = []
    master_list, slide_list = "", ""
    layout_no, slide_no = 0, 0
    next_id = 2147483648
    CT = "application/vnd.openxmlformats-officedocument"

    for m, mode in enumerate(SCHEMES, start=1):
        master_id = next_id
        next_id += 1
        layouts = build_layouts(mode)
        master_layouts, master_rels = [], []
        by_name = {}
        for rid_n, layout in enumerate(layouts, start=1):
            layout_no += 1
            by_name[layout["name"]] = layout_no
            i, layout_rels = Ids(), [("rId1", "slideMaster", f"../slideMasters/slideMaster{m}.xml")]

            def img(key, _rels=layout_rels):
                target = f"../media/{key.split('/')[1]}.png"
                for rid, _, existing in _rels:
                    if existing == target:
                        return rid
                rid = f"rId{len(_rels) + 1}"
                _rels.append((rid, "image", target))
                return rid

            bg = ""
            if layout["bg"]:
                rid = f"rId{len(layout_rels) + 1}"
                layout_rels.append((rid, "image", f"../media/bg-{mode}-{layout['bg']}.jpg"))
                bg = bg_image(rid)
            shapes = layout["shapes"](i, img)
            show = "" if layout["footer"] else ' showMasterSp="0"'
            files[f"ppt/slideLayouts/slideLayout{layout_no}.xml"] = (
                f'{XML}<p:sldLayout {NS} type="{layout["type"]}" preserve="1"{show}>'
                f'<p:cSld name="{escape(layout["name"])}">{bg}{tree(shapes)}</p:cSld>'
                "<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>"
            )
            files[f"ppt/slideLayouts/_rels/slideLayout{layout_no}.xml.rels"] = rels(layout_rels)
            overrides.append((f"/ppt/slideLayouts/slideLayout{layout_no}.xml", f"{CT}.presentationml.slideLayout+xml"))
            master_rels.append((f"rId{rid_n}", "slideLayout", f"../slideLayouts/slideLayout{layout_no}.xml"))
            master_layouts.append((next_id, f"rId{rid_n}"))
            next_id += 1

        n = len(master_rels)
        master_rels += [
            (f"rId{n + 1}", "theme", f"../theme/theme{m}.xml"),
            (f"rId{n + 2}", "image", f"../media/bg-{mode}-content.jpg"),
            (f"rId{n + 3}", "image", "../media/mark.png"),
        ]
        files[f"ppt/slideMasters/slideMaster{m}.xml"] = master_xml(mode, master_layouts, f"rId{n + 2}", f"rId{n + 3}")
        files[f"ppt/slideMasters/_rels/slideMaster{m}.xml.rels"] = rels(master_rels)
        files[f"ppt/theme/theme{m}.xml"] = theme_xml(mode)
        overrides.append((f"/ppt/slideMasters/slideMaster{m}.xml", f"{CT}.presentationml.slideMaster+xml"))
        overrides.append((f"/ppt/theme/theme{m}.xml", f"{CT}.theme+xml"))
        pres_rels.append((f"rIdM{m}", "slideMaster", f"slideMasters/slideMaster{m}.xml"))
        master_list += f'<p:sldMasterId id="{master_id}" r:id="rIdM{m}"/>'

        for sample in sample_slides(mode):
            slide_no += 1
            files[f"ppt/slides/slide{slide_no}.xml"] = slide_xml(sample, mode)
            files[f"ppt/slides/_rels/slide{slide_no}.xml.rels"] = rels(
                [("rId1", "slideLayout", f"../slideLayouts/slideLayout{by_name[sample['layout']]}.xml")]
            )
            overrides.append((f"/ppt/slides/slide{slide_no}.xml", f"{CT}.presentationml.slide+xml"))
            pres_rels.append((f"rIdS{slide_no}", "slide", f"slides/slide{slide_no}.xml"))
            slide_list += f'<p:sldId id="{255 + slide_no}" r:id="rIdS{slide_no}"/>'

    files["ppt/presentation.xml"] = (
        f'{XML}<p:presentation {NS} saveSubsetFonts="1"><p:sldMasterIdLst>{master_list}</p:sldMasterIdLst>'
        f'<p:sldIdLst>{slide_list}</p:sldIdLst><p:sldSz cx="{emu(W)}" cy="{emu(H)}" type="screen16x9"/>'
        f'<p:notesSz cx="{emu(H)}" cy="{emu(W)}"/></p:presentation>'
    )
    files["ppt/_rels/presentation.xml.rels"] = rels(pres_rels)
    files["_rels/.rels"] = (
        f'{XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        f'<Relationship Id="rId1" Type="{REL}/officeDocument" Target="ppt/presentation.xml"/>'
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
        "</Relationships>"
    )
    files["docProps/core.xml"] = (
        f'{XML}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Virge slides theme</dc:title>'
        "<dc:creator>Virge.io</dc:creator></cp:coreProperties>"
    )
    overrides.append(("/docProps/core.xml", "application/vnd.openxmlformats-package.core-properties+xml"))
    overrides.append(("/ppt/presentation.xml", f"{CT}.presentationml.presentation.main+xml"))
    types = "".join(f'<Override PartName="{p}" ContentType="{c}"/>' for p, c in overrides)
    files["[Content_Types].xml"] = (
        f'{XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Default Extension="png" ContentType="image/png"/><Default Extension="jpg" ContentType="image/jpeg"/>'
        f"{types}</Types>"
    )

    with zipfile.ZipFile(PPTX, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", files.pop("[Content_Types].xml"))
        for name, data in files.items():
            z.writestr(name, data)
        for name, data in media.items():
            z.writestr(f"ppt/media/{name}", data)
    print(f"{PPTX.relative_to(ROOT)}: {PPTX.stat().st_size / 1e6:.2f} MB, {slide_no} slides, {layout_no} layouts")


if __name__ == "__main__":
    build()
