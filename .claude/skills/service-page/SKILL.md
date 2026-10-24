---
name: service-page
description: Upgrade a Virge services page (AI, OpenClaw, SDN, eCommerce, Content) with origin stories, architecture diagrams, deep links to docs and related cases/webinars. Use when asked to pimp, enrich or add sections, links or diagrams to a services page.
---

# Services page upgrade

The SDN page (`src/pages/{en,nl}/sdn.astro`) is the reference build: feature grid → origin callout → architecture diagram → docs block → FAQ → CTA. Bring other services pages to the same depth, adapted to their product.

## Steps

1. **Research before writing.** Every claim about a third-party product (who started it, who uses it, what it consists of) comes from its official site or a primary source, fetched in this session. Every external link is checked with `curl -s -o /dev/null -w '%{http_code}' -L <url>` and returns 200. Done when each fact and link in your draft has a source you actually opened.
2. **Write the copy in both languages.** Add strings under the page's key in `src/i18n/en.json` and `nl.json` (round-trip them with `json.dumps(d, indent=2, ensure_ascii=False) + '\n'`; the files are stored exactly that way). Done when both files hold the same keys and the Dutch reads as written Dutch, not a translation.
3. **Compose the sections** from the components below. The `en` and `nl` page files are identical apart from `const lang`; edit both the same way.
4. **Check it renders.** Screenshot the page at 1440px and 390px wide with the Playwright Chromium in `~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome --headless=new --screenshot=… --window-size=…` against `npx astro dev`, then look at both images. Run `npx astro build`. Done when both widths have no overflow or broken layout and the build completes.

## Components

- `Callout.astro`: titled block with icon, HTML paragraphs and an optional button. Use for origin stories ("Started at SURF…") or a key partnership.
- `ResourceLinks.astro`: grid of deep-link cards (icon, title, one-line description, host shown automatically for external links), plus an optional "From Virge" row for our own case studies and webinars. Pick 6–8 pages a new team should read first, not the docs' table of contents.
- Architecture diagrams are HTML/CSS components, not images, so they follow the theme and stack on mobile. `WfoArchitecture.astro` is the pattern: columns of nodes joined by CSS arrows, one highlighted box for the product itself, labels from i18n. Base the content on the product's own architecture docs and link that page in the caption.
- Related links: our cases live in `src/pages/{lang}/cases/`; pick the next relevant webinar with `getUpcoming()` from `src/data/webinars.ts` so the link never points at a past session.
- Icons are `lucide-static` names (`node_modules/lucide-static/icons/<name>.svg`); brand icons such as `github` do not exist there, use `git-branch`.

## House style

These come from review feedback on earlier pages:

- The company is **Virge**, never "Virge.io", in visible text.
- Links and buttons are plain words: "Details", "Sign me up". Only the back links ("← Back to services") carry an arrow.
- Keep pill-shaped badges rare. A single line of text separated by " · " carries a list of facts better.
- The accent colour in an `h1` (`<span>` in the title string) sits on the word that carries the meaning.
- Prefer full words over contractions in headings ("do not" over "don't").
