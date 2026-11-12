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

**FORM:** User-selected technical editorial layout and code-first refinement. On 2026-11-10 the user requested the thumbnail diagram style for the architecture and one combined simple/technical view. Circular nodes and fine labeled links expose the request path, planner, three specialists, two MCP servers and three systems together. The subsequent logo variant uses the actual LibreChat, Workflow Orchestrator and NetBox marks; generic roles retain Lucide icons. Hover or keyboard focus highlights direct connections and reveals technical explanations in a stable panel below; tapping pins a selection. A three-column mobile flow replaces the desktop five-column map. The supplied style and narrow scope require no new visual-world concept or seed.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Quality bar

The recording leads the page. Findings and follow-up retain their source meaning. Every architecture node remains visible without horizontal scrolling on phones. Both languages inherit the original site typography and palette, without loading the optional fonts. Demo cards have distinct, localized scenario diagrams, while video posters retain real recording frames. Keyboard focus, readable contrast, reduced motion and native video controls work. The shared network-mcp → WFO connection remains explicit, distinct from SR Linux measurements. Explanations stay available when moving the pointer into their text and Escape dismisses them; a text fallback preserves the technical content without JavaScript.

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

## Combined architecture and logo variant — 2026-11-10

- `WfoDemoSetup.astro` combines the overview and technical content into one twelve-node graph. Its five-column desktop map becomes three columns at 760px; circles measure 52px on desktop and 44px on phones. Fine protocol links and the separate dashed network-mcp → WFO connection preserve the verified evidence paths.
- Hover and keyboard focus reveal each node's role, protocols and direct connections. A tap or click pins the selection; Escape clears it. The explanation panel reserves space below the graph, and a no-JavaScript definition list retains the technical copy.
- The logo variant reuses the existing LibreChat and WFO assets. NetBox uses the original symbol paths and colors from the existing logo, with a white circular backing for contrast. Asset provenance is in `public/images/cases/wfo-demos/SOURCES.md`; planner, specialists, MCP tools and SR Linux retain Lucide icons. The preceding icon-only captures are retained as `en-1440-icons.png` and `en-390-icons.png` under `.impeccable/review/architecture/`.
- The WFO circle uses the logo image’s sampled background (`#04385f`) at rest, on hover and when selected. Its wrapper clips overflow to the circular boundary so the square asset cannot protrude at either node size.
- This extension inherits the active navy/purple CSS variables and system font. Source comparison covered `WfoDemoSetup.astro`, `WfoDemoThumbnail.astro` and `src/styles/global.css`; no new global token or type system was introduced. `DESIGN.md` and `.impeccable/design.json` remain the inactive Warm Noir reference, including its historical architecture disclosure. Detector type-ramp advisories against that alternative do not change the active system.

## Certificate lifecycle use case — 2026-11-10

Added `src/components/WfoUseCase.astro` at `/{en,nl}/cases/wfo-certificate-lifecycle/` (registry entry `U-2001`, `kind: 'concept'` in `src/data/wfo-demos.ts`). It turns a common certificate-lifecycle-management need into a static illustrative scenario: pressure cards, a seven-step agent/WFO story, the interactive architecture, a crypto-agility campaign in waves, why orchestration, boundaries and FAQ. No recording, no organisation name, rounded figures, generic services with "e.g." examples.

Direction: agents decide, WFO orchestrates. The agents are read-only; after a person approves, WFO executes across eight services (CMDB, ITSM, vault/HSM, public CA, internal PKI, DNS, deploy targets, scanner). This deliberately differs from the recorded network demos, which never execute changes.

The architecture was extracted into `src/components/ServiceMap.astro` (nodes, edges and phone positions are props; edges may run right-to-left on phones). `WfoDemoSetup.astro` is now a wrapper; its before/after screenshots at 1440 and 390px are byte-identical. Original navy/purple theme and system fonts; no Warm Noir.

Verification: 15 detail panels focus-test in EN/NL at 1440 and 320px with stable panel height, no horizontal overflow at 320/390/768/1440, no console errors.

## Certificate lifecycle walkthrough — 2026-11-11

The certificate page now follows the recorded demos' diagram section. A dashed "Hypothetical scenario" alert sits above the You row, and the header tag is "Concept". `You` is an `outside` node of `ServiceMap`; "The exact request" stays visible beside it, with Previous step / Next step / Show every step and a step card below. The old separate story list is removed; "Show every step" expands all nine in place.

The story has nine steps (the last two are the agents confirming the result and the planner answering in chat). Each step lights its own nodes and edges (`stepNodes`/`stepEdges` in `WfoUseCase.astro`) through a `map:highlight` event that `ServiceMap` listens for; the step is the baseline and exploring a node overrides it temporarily. Hovering or tapping one of step 6's eight sub-steps narrows the highlight to its services. Buttons that scroll away float as a pill (full width on phones) while the diagram is in view. Without JavaScript every step shows as a timeline. A problem-and-fix section (three pairs: hidden failures → agents investigate, many systems → one WFO workflow, policy change → crypto-agility as a product parameter) leads the page, followed by the walkthrough. The former stat block and the campaign-in-waves section were removed; the waves idea now lives in the third pair.

Verification: production build (129 pages); all nine steps EN/NL, sub-step narrowing, explore override, Escape, Show every step and the no-JS fallback checked in a browser; no console errors and no horizontal overflow at 390px. Network and game-server maps regression-checked.
