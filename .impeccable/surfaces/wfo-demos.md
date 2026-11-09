# WFO demo pages and Cases cards

Primary target: `src/components/WfoDemo.astro`
Related targets: `src/components/WfoDemoSetup.astro`, `src/components/WfoDemoCards.astro`
Mode: Experience, with technical reading below the recording.

The user approved the redesigned layout on 2026-11-09, then requested the original theme again: all four EN/NL demos and their existing Cases cards use the original navy/purple palette and system typography. Keep the recording-and-findings-first composition, compact service-logo strip and responsive architecture. The user subsequently chose scenario diagrams for the Cases thumbnails; see `wfo-thumbnails.md`. Real recording stills remain the detail-page posters. Preserve Warm Noir with Sora + Manrope as an inactive screenshot reference in PR #23. Preserve the technical copy, caveats, links and original recordings. No site-wide redesign, new routes or deployment.

Reference: https://gist.github.com/d5bcbb506fe1477c7162012ac35c68df

## Direction contract

**THESIS:** A technical demonstration reads as a clear evidence report. The recording leads; diagnosis and next steps are distinct. Repeated rounded text boxes do not set the reading rhythm.

**OWN-WORLD:** The existing dark navy ground, purple accents and system font from the site. The redesigned composition keeps crisp image frames, open reading sections and fine dividers. The prior brown-charcoal/Sora/Manrope alternative is inactive; its exact appearance is archived in `docs/previews/wfo-warm-noir-sora-manrope.png`.

**STORY:** Identify the scenario, watch the real investigation, read its finding, inspect the method and architecture, understand execution boundaries, then explore implementation or discuss an integration.

**FIRST VIEWPORT:** A compact back link and scenario metadata precede the large heading and concise introduction. Below, a two-thirds-width recording sits beside an editorial findings column. On phones the recording precedes the findings; all copy wraps naturally.

**FORM:** User-selected technical editorial layout, approved in the implementation plan. No generated comp or random seed: the user supplied the palette, fonts, finish, composition and code-first workflow. The signature disclosure replaces the compact architecture overview with the verified detailed graph; the overview becomes a vertical flow on phones.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Quality bar

The recording remains the largest content artifact. Findings and follow-up retain their source meaning. Every architecture overview node is visible without horizontal scrolling on phones. Both languages inherit the original site typography and palette, without loading the optional fonts. Demo cards have distinct, localized scenario diagrams, while video posters retain real recording frames. Keyboard focus, readable contrast, reduced motion and native video controls work.

## Tooling

The Impeccable context launcher could not load its engine in this environment; project context and references were read directly. Use this brief with PRODUCT.md and the implementation. The shipped reference workflows remain the review and documentation authority.

## Warm Noir verification — 2026-11-09 (historical alternative)

- Production build: 123 pages; whitespace check clean.
- Browser verification: 44 checks pass with no failures, including all eight demo routes at 390/768/900/1440px, Cases indexes, playback/preferences, keyboard focus, disclosures, language/navigation and theme isolation.
- Palette text roles pass AA; white button text has 4.83:1 contrast. Fonts are self-hosted WOFF2 with original OFL licenses.
- Previews show the completed recorded responses at 00:24, with source path, hash, timestamp and crop in the source manifest and origin in WebP EXIF.
- Independent Impeccable finish review: **ship**. All six required desktop/phone captures are valid; no material fixes remain. Full review: `/tmp/virge-wfo-finish-review.md`.
- Source and browser checks confirm the original scenario data, source recordings, social posters and routes are unchanged. Delivery is local, uncommitted and undeployed.

## Original theme restored — 2026-11-09

- The original navy/purple palette and system font are active on all eight demo routes and their Cases cards; optional Sora/Manrope fonts are not loaded by default.
- The approved redesigned layout, recording previews, mobile architecture and native controls remain. The detailed SVG uses the current theme variables rather than hard-coded Noir colors.
- Production build passes (123 pages). All 44 browser checks pass with no failures; screenshots are under `.impeccable/review/original-theme/` and the report is `/tmp/virge-wfo-original-theme-results.json`.
- `docs/previews/wfo-warm-noir-sora-manrope.png` preserves the prior real Noir screenshot, with source metadata and a README. PR #23 embeds it as an explicitly inactive design alternative.
