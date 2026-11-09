# WFO demo pages and Cases cards

Primary target: `src/components/WfoDemo.astro`
Related targets: `src/components/WfoDemoSetup.astro`, `src/components/WfoDemoCards.astro`
Mode: Experience, with technical reading below the recording.

The user approved the implementation plan on 2026-11-09: all four EN/NL demos and their existing Cases cards; recording and findings first; flat Warm Noir; Sora + Manrope; actual recording stills with a compact service-logo strip; code-first browser review. Preserve the technical copy, caveats, links and original recordings. No site-wide redesign, new routes or deployment.

Reference: https://gist.github.com/d5bcbb506fe1477c7162012ac35c68df

## Direction contract

**THESIS:** A technical demonstration reads as a clear evidence report. The recording leads; diagnosis and next steps are distinct. Repeated rounded text boxes do not set the reading rhythm.

**OWN-WORLD:** Flat brown-charcoal ground, bone text, warm fine dividers, quiet blue actions, Sora semibold headings and Manrope body. Crisp image frames and generous section gaps replace purple glows.

**STORY:** Identify the scenario, watch the real investigation, read its finding, inspect the method and architecture, understand execution boundaries, then explore implementation or discuss an integration.

**FIRST VIEWPORT:** A compact back link and scenario metadata precede the large heading and concise introduction. Below, a two-thirds-width recording sits beside an editorial findings column. On phones the recording precedes the findings; all copy wraps naturally.

**FORM:** User-selected technical editorial layout, approved in the implementation plan. No generated comp or random seed: the user supplied the palette, fonts, finish, composition and code-first workflow. The signature disclosure replaces the compact architecture overview with the verified detailed graph; the overview becomes a vertical flow on phones.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Quality bar

The recording remains the largest content artifact. Findings and follow-up retain their source meaning. Every architecture overview node is visible without horizontal scrolling on phones. Both languages use the chosen fonts. Demo cards have distinct, sourced recording frames. No purple chrome, ornamental shadow or gradient survives in the redesigned surfaces. Keyboard focus, readable contrast, reduced motion and native video controls work.

## Tooling

The Impeccable context launcher could not load its engine in this environment; project context and references were read directly. Use this brief with PRODUCT.md and the implementation. The shipped reference workflows remain the review and documentation authority.

## Final verification — 2026-11-09

- Production build: 123 pages; whitespace check clean.
- Browser verification: 44 checks pass with no failures, including all eight demo routes at 390/768/900/1440px, Cases indexes, playback/preferences, keyboard focus, disclosures, language/navigation and theme isolation.
- Palette text roles pass AA; white button text has 4.83:1 contrast. Fonts are self-hosted WOFF2 with original OFL licenses.
- Previews show the completed recorded responses at 00:24, with source path, hash, timestamp and crop in the source manifest and origin in WebP EXIF.
- Independent Impeccable finish review: **ship**. All six required desktop/phone captures are valid; no material fixes remain. Full review: `/tmp/virge-wfo-finish-review.md`.
- Source and browser checks confirm the original scenario data, source recordings, social posters and routes are unchanged. Delivery is local, uncommitted and undeployed.
