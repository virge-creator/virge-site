#!/usr/bin/env python3
"""Build decks/wfo-core-principles.pptx on the Virge slide theme.

Diagrams are native shapes, so they stay editable after importing into Google
Slides. Examples come from the workfloworchestrator example-orchestrator repo.

    python3 scripts/styleguide/build_wfo_core_deck.py
"""
from __future__ import annotations

from xml.sax.saxutils import escape

from build_slides_theme import (
    CODE_FONT, MUTED, ROOT, build, emu, gradient_fill, rgb, scheme, xfrm,
)

OUTPUT = ROOT / "decks" / "wfo-core-principles.pptx"
TITLE = 'type="title"'
HIGHLIGHT = "accent5"
MODE = "dark"


def colour_fill(colour: str) -> str:
    if colour == "muted":
        return rgb(MUTED[MODE])
    return rgb(colour) if len(colour) == 6 and colour.isalnum() and colour.isupper() else scheme(colour)


def run(text, size=12, bold=False, colour="tx2", font="+mn-lt") -> str:
    latin = f'<a:latin typeface="{font}"/><a:cs typeface="{font}"/>'
    return (
        f'<a:r><a:rPr lang="en-US" sz="{round(size * 100)}" b="{int(bold)}">{colour_fill(colour)}{latin}</a:rPr>'
        f"<a:t>{escape(text)}</a:t></a:r>"
    )


def para(*runs, align="l", before=0) -> str:
    return f'<a:p><a:pPr algn="{align}"><a:spcBef><a:spcPts val="{before * 100}"/></a:spcBef></a:pPr>{"".join(runs)}</a:p>'


def code(text, size=10.5, colour="tx2", before=0, bold=False) -> str:
    """One line of monospace text. Leading spaces survive because <a:t> keeps them."""
    return para(run(text, size, bold, colour, CODE_FONT), before=before)


def box(i, name, rect, paras=None, fill=None, line=None, geom="roundRect", anchor="t", inset=0.12,
        radius=6000, dash=False) -> str:
    av = f'<a:avLst><a:gd name="adj" fmla="val {radius}"/></a:avLst>' if geom == "roundRect" else "<a:avLst/>"
    fill_xml = fill if fill else "<a:noFill/>"
    if line:
        style = '<a:prstDash val="dash"/>' if dash else ""
        ln = f'<a:ln w="12700">{colour_fill(line)}{style}</a:ln>'
    else:
        ln = "<a:ln><a:noFill/></a:ln>"
    margin = emu(inset)
    body = "".join(paras) if paras else '<a:p><a:endParaRPr lang="en-US"/></a:p>'
    return (
        f'<p:sp><p:nvSpPr><p:cNvPr id="{i()}" name="{escape(name)}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>'
        f'<p:spPr>{xfrm(rect)}<a:prstGeom prst="{geom}">{av}</a:prstGeom>{fill_xml}{ln}</p:spPr>'
        f'<p:txBody><a:bodyPr wrap="square" lIns="{margin}" tIns="{margin}" rIns="{margin}" bIns="{margin}" '
        f'rtlCol="0" anchor="{anchor}"><a:noAutofit/></a:bodyPr><a:lstStyle/>{body}</p:txBody></p:sp>'
    )


def card(i, name, rect, paras=None, **kw) -> str:
    return box(i, name, rect, paras, fill=scheme("bg2"), **kw)


def label(i, name, rect, paras, anchor="t") -> str:
    return box(i, name, rect, paras, geom="rect", inset=0, anchor=anchor)


def strip(i, text, y=4.27, h=0.58) -> str:
    """The one-line takeaway under a diagram."""
    return card(i, "Takeaway", (0.5, y, 9.0, h), [para(run(text, 13, False, "tx1"))], anchor="ctr", inset=0.18)


def eyebrow(i, text) -> str:
    runs = f'<a:r><a:rPr lang="en-US" sz="1000" b="1" spc="150">{scheme(HIGHLIGHT)}<a:latin typeface="+mn-lt"/></a:rPr><a:t>{escape(text)}</a:t></a:r>'
    return label(i, "Eyebrow", (0.5, 0.18, 9.0, 0.2), [f"<a:p>{runs}</a:p>"])


def dot(i, n, x, y, d=0.42) -> str:
    return box(i, f"Number {n}", (x, y, d, d), [para(run(str(n), 14, True, "FFFFFF"), align="ctr")],
               fill=gradient_fill(), geom="ellipse", anchor="ctr", inset=0)


def arrow(i, x1, y1, x2, y2, colour=HIGHLIGHT) -> str:
    flip = (' flipH="1"' if x2 < x1 else "") + (' flipV="1"' if y2 < y1 else "")
    off = f'<a:off x="{emu(min(x1, x2))}" y="{emu(min(y1, y2))}"/><a:ext cx="{emu(abs(x2 - x1))}" cy="{emu(abs(y2 - y1))}"/>'
    sid = i()
    return (
        f'<p:cxnSp><p:nvCxnSpPr><p:cNvPr id="{sid}" name="Arrow {sid}"/><p:cNvCxnSpPr/><p:nvPr/></p:nvCxnSpPr>'
        f'<p:spPr><a:xfrm{flip}>{off}</a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom>'
        f'<a:ln w="15875">{colour_fill(colour)}<a:tailEnd type="triangle"/></a:ln></p:spPr></p:cxnSp>'
    )


def table(i, x, y, widths, rows, row_h=0.33) -> str:
    grid = "".join(f'<a:gridCol w="{emu(w)}"/>' for w in widths)
    rule = f'<a:lnB w="6350">{scheme("bg2")}</a:lnB>'
    none = "".join(f"<a:ln{s}><a:noFill/></a:ln{s}>" for s in "LRT")
    body = ""
    for r, row in enumerate(rows):
        cells = ""
        for c, value in enumerate(row):
            if r == 0:
                text = para(run(value, 11, True, "muted"))
            elif c == 0:
                text = para(run(value, 11, False, "tx1", CODE_FONT))
            else:
                text = para(run(value, 12, c == 1, HIGHLIGHT if c == 1 else "tx2"))
            cells += (
                f"<a:tc><a:txBody><a:bodyPr/><a:lstStyle/>{text}</a:txBody>"
                f'<a:tcPr marL="{emu(0.08)}" marR="{emu(0.08)}" marT="{emu(0.04)}" marB="{emu(0.04)}" anchor="ctr">'
                f"{none}{rule}<a:noFill/></a:tcPr></a:tc>"
            )
        body += f'<a:tr h="{emu(row_h)}">{cells}</a:tr>'
    sid = i()
    return (
        f'<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="{sid}" name="Step types"/>'
        '<p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr><p:nvPr/></p:nvGraphicFramePr>'
        f'<p:xfrm><a:off x="{emu(x)}" y="{emu(y)}"/><a:ext cx="{emu(sum(widths))}" cy="{emu(row_h * len(rows))}"/></p:xfrm>'
        '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table">'
        f'<a:tbl><a:tblPr firstRow="1"/><a:tblGrid>{grid}</a:tblGrid>{body}</a:tbl></a:graphicData></a:graphic></p:graphicFrame>'
    )


# --- Slides -----------------------------------------------------------------


def overview(i, mode):
    items = [
        ("Subscriptions", "What a customer has, tracked through its lifecycle"),
        ("Products and product blocks", "The model that every subscription is an instance of"),
        ("Workflows and tasks", "Ordered steps that change subscriptions, with state stored along the way"),
        ("Validation and consistency", "Checks that the model and the real network still agree"),
    ]
    out = ""
    for n, (head, text) in enumerate(items):
        x, y = (0.5, 5.1)[n % 2], (1.3, 3.18)[n // 2]
        out += card(i, f"Principle {n + 1}", (x, y, 4.4, 1.68))
        out += dot(i, n + 1, x + 0.2, y + 0.6, 0.48)
        out += label(i, head, (x + 0.86, y + 0.15, 3.34, 1.38), [
            para(run(head, 16, True, "tx1")), para(run(text, 13.5), before=5)], anchor="ctr")
    return out


def subscriptions(i, mode):
    out = eyebrow(i, "1 · SUBSCRIPTIONS")
    out += card(i, "Product", (0.5, 1.72, 2.3, 1.56), [
        para(run("PRODUCT", 10, True, "muted")),
        para(run("L2VPN", 20, True, "tx1"), before=2),
        para(run("The definition: what you can sell", 12), before=4)], inset=0.16)
    rows = [("Customer A", "1000 Mbit/s · active"), ("Customer B", "10 Gbit/s · active"),
            ("Customer A", "100 Mbit/s · provisioning")]
    for n, (who, what) in enumerate(rows):
        y = 1.3 + n * 0.82
        out += arrow(i, 2.8, 2.5, 3.5, y + 0.36)
        out += card(i, f"Subscription {n + 1}", (3.5, y, 2.95, 0.72), [
            para(run(who, 13, True, "tx1")), para(run(what, 11.5, False, "muted"))], anchor="ctr", inset=0.14)
    facts = ["One product, many subscriptions", "Each belongs to one customer", "Usually created by a workflow, not by hand"]
    out += label(i, "Facts", (6.85, 1.34, 2.65, 2.4),
                 [para(run(f, 13), before=0 if n == 0 else 12) for n, f in enumerate(facts)], anchor="ctr")
    return out + strip(i, "The subscription is the record of what should exist: its values and its lifecycle status.", y=4.0, h=0.62)


def lifecycle(i, mode):
    out = eyebrow(i, "1 · SUBSCRIPTIONS")
    bar = gradient_fill()
    out += box(i, "Create workflow", (0.5, 1.33, 5.6, 0.36), [para(run("create workflow", 12, True, "FFFFFF"), align="ctr")],
               fill=bar, anchor="ctr", inset=0.02, radius=50000)
    out += box(i, "Terminate workflow", (6.2, 1.33, 3.3, 0.36), [para(run("terminate workflow", 12, True, "FFFFFF"), align="ctr")],
               fill=bar, anchor="ctr", inset=0.02, radius=50000)
    states = [
        ("Initial", ["ims_id: int | None", "nrm_id: int | None"]),
        ("Provisioning", ["ims_id: int", "nrm_id: int | None"]),
        ("Active", ["ims_id: int", "nrm_id: int"]),
        ("Terminated", None),
    ]
    for n, (name, fields) in enumerate(states):
        x = 0.5 + n * 2.3
        lines = [para(run(name, 15, True, "tx1"))]
        if fields:
            lines += [code(f, 10, before=5 if k == 0 else 0) for k, f in enumerate(fields)]
        else:
            lines.append(para(run("The record stays as history", 11.5), before=5))
        out += card(i, name, (x, 1.87, 2.1, 1.12), lines, inset=0.13)
        if n < 3:
            out += arrow(i, x + 2.1, 2.43, x + 2.3, 2.43)
    out += box(i, "Modify and validate", (3.95, 3.13, 4.4, 0.36),
               [para(run("modify, validate and reconcile workflows", 12, True, HIGHLIGHT), align="ctr")],
               line=HIGHLIGHT, anchor="ctr", inset=0.02, radius=50000)
    return out + strip(i, "Types tighten per lifecycle: moving on fails if a required value is still missing.", y=3.72, h=0.58) + label(
        i, "Other statuses", (0.5, 4.45, 9.0, 0.3), [para(run("Two more statuses exist for special cases: Migrating and Disabled.", 12, False, "muted"))])


def products(i, mode):
    out = eyebrow(i, "2 · PRODUCTS AND PRODUCT BLOCKS")
    chain = [
        ("PRODUCT", "L2VPN", ["virtual_circuit"]),
        ("BLOCK", "VirtualCircuit", ["speed", "saps"]),
        ("BLOCK", "SAP", ["vlan", "port"]),
        ("BLOCK", "Port", ["port_name", "node"]),
        ("BLOCK", "Node", ["node_name", "ims_id"]),
    ]
    width, gap = 1.62, 0.225
    for n, (kind, name, fields) in enumerate(chain):
        x = 0.5 + n * (width + gap)
        out += card(i, name, (x, 1.3, width, 1.4), [
            para(run(kind, 9.5, True, "muted")), para(run(name, 13, True, "tx1"), before=2),
            *[code(f, 10, before=5 if k == 0 else 0) for k, f in enumerate(fields)]], inset=0.09)
        if n < 4:
            out += arrow(i, x + width, 2.0, x + width + gap, 2.0)
    terms = [
        ("Product", "What you sell: one or more blocks and any fixed inputs"),
        ("Product block", "A reusable group of values that can point to other blocks"),
        ("Resource type", "One typed value in a block, like port_name"),
        ("Fixed input", "Set by the product itself: Port 10G has speed 10000"),
    ]
    for n, (term, text) in enumerate(terms):
        out += label(i, term, (0.5 + n * 2.3, 3.05, 2.1, 1.6), [
            para(run(term, 14, True, HIGHLIGHT)), para(run(text, 13), before=4)])
    return out


def graph(i, mode):
    out = eyebrow(i, "2 · PRODUCTS AND PRODUCT BLOCKS")
    groups = [
        ((0.5, 3.75), "L2VPN subscription", "Customer A", ["VirtualCircuit", "SAP"]),
        ((4.45, 2.35), "Port subscription", "Customer B", ["Port"]),
        ((7.0, 2.5), "Node subscription", "Network operator", ["Node"]),
    ]
    for (x, w), head, owner, blocks in groups:
        out += box(i, head, (x, 1.3, w, 2.05), [
            para(run(head, 13, True, "tx1")), para(run(owner, 11.5, False, "muted"))],
            line="muted", dash=True, inset=0.13)
    out += box(i, "VirtualCircuit", (0.65, 2.35, 1.65, 0.75), [para(run("VirtualCircuit", 12.5, True, "tx1"), align="ctr")],
               fill=scheme("bg2"), anchor="ctr", inset=0.04)
    out += box(i, "SAP", (2.75, 2.35, 1.3, 0.75), [para(run("SAP", 12.5, True, "tx1"), align="ctr")],
               fill=scheme("bg2"), anchor="ctr", inset=0.04)
    out += box(i, "Port", (4.75, 2.35, 1.6, 0.75), [para(run("Port", 12.5, True, "tx1"), align="ctr")],
               fill=scheme("bg2"), anchor="ctr", inset=0.04)
    out += box(i, "Node", (7.45, 2.35, 1.6, 0.75), [para(run("Node", 12.5, True, "tx1"), align="ctr")],
               fill=scheme("bg2"), anchor="ctr", inset=0.04)
    out += arrow(i, 2.3, 2.72, 2.75, 2.72) + arrow(i, 4.05, 2.72, 4.75, 2.72) + arrow(i, 6.35, 2.72, 7.45, 2.72)
    facts = [
        ("Ownership", "A block belongs to the subscription that holds it"),
        ("Boundaries", "A workflow on the L2VPN leaves the Port's values alone"),
        ("Dependencies", "A Node with Ports in use should not be terminated"),
    ]
    for n, (head, text) in enumerate(facts):
        out += label(i, head, (0.5 + n * 3.08, 3.6, 2.84, 1.25), [
            para(run(head, 14, True, HIGHLIGHT)), para(run(text, 13), before=4)])
    return out


def workflows(i, mode):
    out = eyebrow(i, "3 · WORKFLOWS AND TASKS")
    out += card(i, "Workflows", (0.5, 1.3, 4.4, 2.75), [
        para(run("Workflows", 18, True, "tx1")),
        para(run("Attached to a product and run on one of its subscriptions", 14), before=5)], inset=0.2)
    out += card(i, "Tasks", (5.1, 1.3, 4.4, 2.75), [
        para(run("Tasks", 18, True, "tx1")),
        para(run("Not tied to a product. Started by the scheduler or by hand", 14), before=5),
        code("task_validate_subscriptions", 12, HIGHLIGHT, before=14),
        code("task_validate_products", 12, HIGHLIGHT, before=4)], inset=0.2)
    pills = [("create", 0.7, 0.86), ("modify", 1.64, 0.86), ("terminate", 2.58, 1.1), ("validate", 0.7, 1.0), ("reconcile", 1.78, 1.12)]
    for n, (name, x, w) in enumerate(pills):
        out += box(i, name, (x, 2.68 if n < 3 else 3.18, w, 0.38), [para(run(name, 12, True, HIGHLIGHT), align="ctr")],
                   line=HIGHLIGHT, anchor="ctr", inset=0.02, radius=50000)
    return out + strip(i, "Both are plain Python: a linear list of steps, run in order by the same engine.")


def state(i, mode):
    out = eyebrow(i, "3 · WORKFLOWS AND TASKS")
    columns = [
        ("Input form", [], ["product", "customer_id", "port_mode", "lldp"]),
        ("Construct model", ["product", "customer_id", "port_mode", "lldp"], ["subscription_id", "subscription"]),
        ("Enable port", ["product", "customer_id", "port_mode", "lldp", "subscription_id"], ["subscription", "  enabled: True"]),
        ("Set to active", ["product", "customer_id", "port_mode", "lldp", "subscription_id"], ["subscription", "  status: active"]),
    ]
    for n, (name, old, new) in enumerate(columns):
        x = 0.5 + n * 2.3
        out += box(i, f"Step {name}", (x, 1.3, 2.1, 0.48), [para(run(name, 13, True, "FFFFFF"), align="ctr")],
                   fill=scheme("accent1"), anchor="ctr", inset=0.03)
        if n < 3:
            out += arrow(i, x + 2.1, 1.54, x + 2.3, 1.54)
        lines = [code(k, 10.5, "muted") for k in old] + [code(k, 10.5, HIGHLIGHT, bold=True) for k in new]
        out += card(i, f"State after {name}", (x, 1.9, 2.1, 1.85), lines, inset=0.13)
    return out + strip(i, "The state after every step is stored in the database, so a process is its own audit log.", y=3.93, h=0.62) + label(
        i, "Source", (0.5, 4.63, 9.0, 0.26), [para(run("Example: create_port in example-orchestrator", 10, False, "muted"))])


def step_code(i, mode):
    out = eyebrow(i, "3 · WORKFLOWS AND TASKS")
    lines = ['@step("enable port in IMS")', "def enable_port(", "    subscription: PortProvisioning,",
             ") -> State:", "    subscription.port.enabled = True", '    return {"subscription": subscription}']
    out += card(i, "Step code", (0.5, 1.3, 5.0, 3.55), [code(l, 12, before=6) for l in lines], anchor="ctr", inset=0.25)
    notes = [
        "Parameter names are looked up as state keys",
        "A domain model is loaded fresh from the database by its ID",
        "The returned dictionary is merged into the state",
        "Returned domain models are saved automatically",
    ]
    for n, text in enumerate(notes):
        y = 1.3 + n * 0.92
        out += dot(i, n + 1, 5.75, y + 0.06)
        out += label(i, f"Note {n + 1}", (6.3, y - 0.06, 3.2, 0.66), [para(run(text, 14))], anchor="ctr")
    return out


def failure(i, mode):
    out = eyebrow(i, "3 · WORKFLOWS AND TASKS")
    steps = [
        ("Construct model", "Done", scheme("bg2"), "tx1"),
        ("Provision in NRM", "Done", scheme("bg2"), "tx1"),
        ("Update IMS", "Failed: retry", scheme("accent4"), "0A0A1A"),
        ("Set to active", "Not started", None, "muted"),
    ]
    for n, (name, status, fill, colour) in enumerate(steps):
        x = 0.5 + n * 2.3
        sub = colour if colour == "0A0A1A" else "muted"
        out += box(i, name, (x, 1.3, 2.1, 0.72), [
            para(run(name, 13, True, colour), align="ctr"), para(run(status, 11, False, sub), align="ctr")],
            fill=fill, line=None if fill else "muted", dash=not fill, anchor="ctr", inset=0.03)
        if n < 3:
            out += arrow(i, x + 2.1, 1.66, x + 2.3, 1.66)
    out += table(i, 0.5, 2.2, [2.1, 2.3, 4.6], [
        ["Step type", "Stops as", "What happens next"],
        ["step", "Failed", "An operator retries it, as often as needed"],
        ["retrystep", "Waiting", "The engine retries it periodically"],
        ["inputstep", "Suspended", "A person fills in a form"],
        ["callback_step", "Awaiting callback", "An external system reports back"],
    ], row_h=0.34)
    return out + strip(i, "Database changes roll back; external ones do not. So keep steps idempotent.", y=4.0, h=0.58) + label(
        i, "Rule", (0.5, 4.63, 9.0, 0.26), [para(run("A retry starts from the state of the last completed step.", 11, False, "muted"))])


def consistency(i, mode):
    out = eyebrow(i, "4 · VALIDATION AND CONSISTENCY")
    cards = [
        ("While writing", "Domain models", "Values are typed and required per lifecycle, so bad data fails early", None),
        ("While running", "The insync lock", "A workflow locks the subscription first. Others are refused until it is done", "unsync >> ... >> resync"),
        ("Afterwards", "Scheduled validation", "A nightly task starts the validate workflow of every subscription", None),
    ]
    for n, (moment, head, text, snippet) in enumerate(cards):
        lines = [para(run(moment.upper(), 10, True, "muted")), para(run(head, 16, True, "tx1"), before=3),
                 para(run(text, 14), before=7)]
        if snippet:
            lines.append(code(snippet, 11, HIGHLIGHT, before=9))
        out += card(i, head, (0.5 + n * 3.07, 1.3, 2.86, 2.5), lines, inset=0.17)
    return out + strip(i, "Out of sync is a signal: something is running, or something needs attention.", y=4.0, h=0.62)


def validate(i, mode):
    out = eyebrow(i, "4 · VALIDATION AND CONSISTENCY")
    out += card(i, "Orchestrator", (0.5, 1.3, 2.5, 1.5), [
        para(run("EXPECTED", 10, True, "muted")), para(run("Orchestrator", 15, True, "tx1"), before=3),
        para(run("The subscription", 12.5), before=4)], anchor="ctr", inset=0.17)
    out += card(i, "External systems", (7.0, 1.3, 2.5, 1.5), [
        para(run("ACTUAL", 10, True, "muted")), para(run("External systems", 15, True, "tx1"), before=3),
        para(run("Netbox, the network", 12.5), before=4)], anchor="ctr", inset=0.17)
    out += label(i, "Validate label", (3.1, 1.38, 3.8, 0.28), [para(run("validate: compare, fail on a difference", 12, True, HIGHLIGHT), align="ctr")])
    out += arrow(i, 6.95, 1.76, 3.05, 1.76)
    out += label(i, "Reconcile label", (3.1, 2.08, 3.8, 0.28), [para(run("reconcile: write the subscription out", 12, True, "accent3"), align="ctr")])
    out += arrow(i, 3.05, 2.46, 6.95, 2.46, "accent3")
    out += card(i, "After a failed validate", (0.5, 3.05, 4.4, 1.8), [
        para(run("When validate finds a difference", 14.5, True, HIGHLIGHT)),
        para(run("The workflow fails with an Actual => Expected diff. The subscription stays out of sync, so other workflows wait.", 13.5), before=5)], inset=0.18)
    out += card(i, "Reconcile", (5.1, 3.05, 4.4, 1.8), [
        para(run("When you reconcile", 14.5, True, "accent3")),
        para(run("A modify without user input. It runs on out-of-sync subscriptions too and ends by unlocking them.", 13.5), before=5)], inset=0.18)
    return out


def slides(mode: str) -> list[dict]:
    if mode != MODE:
        return []
    return [
        dict(layout="Cover · Workflow Orchestrator", fill={
            'type="body" sz="quarter" idx="10"': "WORKFLOW ORCHESTRATOR · CORE",
            'type="ctrTitle"': ["The core principles of the", "Workflow Orchestrator"],
            'type="subTitle" idx="1"': "Subscriptions, products, workflows and state, and how the orchestrator keeps them consistent.",
            'type="body" sz="quarter" idx="11"': "virge.io",
        }, notes="orchestrator-core is un-opinionated about what it orchestrates, but very opinionated about how. This part covers the four ideas everything else is built on."),
        dict(layout="Title only", fill={TITLE: "Four ideas carry the whole orchestrator"}, extra=overview,
             notes="Read them as one story: a product is modelled, a workflow turns it into a subscription, and validation keeps checking that the subscription still matches reality."),
        dict(layout="Title only", fill={TITLE: "A subscription tracks what a customer has"}, extra=subscriptions,
             notes="A subscription is a product instantiated for a specific customer. There can be any number of subscriptions on one product. A subscription is normally created by a create workflow, which is what makes every change traceable."),
        dict(layout="Title only", fill={TITLE: "Workflows drive the subscription lifecycle"}, extra=lifecycle,
             notes="Initial, Provisioning, Active, Terminated. The field types are from PortBlock in example-orchestrator: ims_id is required from Provisioning, nrm_id only from Active. The models live in three classes per lifecycle, so a mistake shows up as a validation error when the lifecycle changes."),
        dict(layout="Title only", fill={TITLE: "A product is a tree of reusable blocks"}, extra=products,
             notes="This is the L2VPN model from example-orchestrator. Product blocks are collections of resource types and can point to other blocks. Fixed inputs are constrained by the product, for example by the physical speed of a port. In the example, Port 10G and Port 100G are separate products with a different speed fixed input."),
        dict(layout="Title only", fill={TITLE: "Blocks connect subscriptions into one graph"}, extra=graph,
             notes="A block can depend on a block from another subscription, even one owned by another customer. An interface owned by one customer can be used in another customer's circuit. Together this gives the orchestrator a logical topology of the network. The database keeps this as in_use_by and depends_on relations. Customer names here are illustrative."),
        dict(layout="Title only", fill={TITLE: "Workflows change subscriptions, tasks do the rest"}, extra=workflows,
             notes="A product normally has one create, terminate, validate and reconcile workflow, and as many modify workflows as it needs. Tasks are workflows with target SYSTEM, for cleanup jobs or for triggering validation across subscriptions."),
        dict(layout="Title only", fill={TITLE: "State is a dictionary that grows with every step"}, extra=state,
             notes="This is the core of the engine. The engine runs functions in order and stores the result of each one. Form input starts the state, and each step adds or changes keys. The state is a log of work, not a place to move data around, so fetch external data at the moment a step needs it. Simplified from create_port: the keys are shortened and a few steps are left out."),
        dict(layout="Title only", fill={TITLE: "A step reads state by name, returns what changes"}, extra=step_code,
             notes="This is real code from create_port. The decorator looks up subscription in the state, finds the ID and loads the domain model from the database, typed for the step. Only the ID in the state is used, not the stored copy. A change to a model is only saved when the step returns it. Do not call commit in a step."),
        dict(layout="Title only", fill={TITLE: "A failed step resumes from the last good state"}, extra=failure,
             notes="Each step is atomic: if it fails, nothing from that step is committed to the database. Retry as often as needed; each retry starts from the last completed step. The call to Netbox or the device has still happened, so steps must be safe to repeat. retrystep, inputstep and callback_step are the deliberate ways to pause. Step names here are simplified."),
        dict(layout="Title only", fill={TITLE: "Consistency is guarded at three moments"}, extra=consistency,
             notes="By default a workflow only starts on an insync subscription, and the first thing it does is mark it out of sync, so two workflows cannot change one subscription at once. The form then says: Subscription already has a running process or task. The default schedule runs task_validate_subscriptions at 00:10 and task_validate_products at 02:30. The second one checks the setup itself: workflows registered, products complete, every subscription loadable."),
        dict(layout="Title only", fill={TITLE: "Validate detects drift, reconcile repairs it"}, extra=validate,
             notes="validate_port in the example fetches the interface from Netbox, builds the expected payload from the subscription and fails on any DeepDiff. Because resync is the last step, a failed validate leaves the subscription out of sync. That blocks further changes until someone looks at it. Validate and reconcile both start with unsync_unchecked, so they can run on a subscription that is already out of sync."),
        dict(layout="Closing", fill={
            TITLE: "Model it, run it, check it",
            'type="body" idx="1"': "Docs: workfloworchestrator.org · Code: github.com/workfloworchestrator",
            'type="body" sz="quarter" idx="10"': "virge.io",
        }, notes="Three steps to remember: model the product, run workflows that keep state, and keep validating against the real world."),
    ]


if __name__ == "__main__":
    build(OUTPUT, slides)
