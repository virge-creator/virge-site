# WFO Cases thumbnails

Primary target: `src/components/WfoDemoThumbnail.astro`
Related targets: `src/components/WfoDemoCards.astro`, `src/data/wfo-demos.ts`
Mode: Experience; the technical reader must recognize which demo to open.

On 2026-11-09 the user rejected the recording thumbnails as uninformative, chose scenario diagrams for the four WFO demos only, and approved the implementation plan. Preserve the original navy/purple theme and system fonts, card copy, service logos, links, recordings, detail-page posters, SURF/JVJ case artwork and archived Noir PR reference. Use static, native HTML/SVG and the existing icon library; no generated imagery or decorative motion.

## Direction contract

**THESIS:** Each thumbnail explains the diagnostic scenario at card size, replacing unreadable miniature chat text with meaningful network geometry.

**OWN-WORLD:** The existing navy ground, purple signals and system typography carry the diagram. Restrained amber marks faults or proposed maintenance, always paired with symbols and localized wording. Fine strokes and open space replace simulated interface panels.

**STORY:** Identify service outage, interface alert, packet loss or maintenance impact, then open the relevant existing demo.

**FIRST VIEWPORT:** Four consistent 16:9 diagram areas occupy the existing Cases cards. A short readable title leads; a three-node diagram carries the center; one concise finding closes the thumbnail. Phone graphics fit the same frame without clipping.

**FORM:** User-selected scenario diagrams in the established site identity, code-first. Outage highlights a disabled port without implying a physical break; alert maps interface to WFO service and SURF; packet-loss symbols are illustrative and show no percentages; maintenance is explicitly proposed, with the recorded window and no alternate path.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Quality bar

Both languages have four distinct, accessible diagram descriptions. Core labels remain readable at 320/390/768/1440px. The complete card remains one keyboard-accessible link. No layout overflow, clipped labels, percentage claims, simulated repair or changed maintenance flag. Recording stills continue to serve detail-page videos.

## Shipping verification — 2026-11-09

- Production build: 123 pages. Browser checks: 16 pass across EN/NL Cases indexes at 320/390/768/1440 and all eight detail pages.
- Independent finish reviewer disposition: **ship** after moving the outage marker to the Paris port; EN/NL labels fit at phone sizes.
- Review image: `docs/previews/wfo-scenario-thumbnails.png`, cropped from a Chromium capture; provenance and source hashes are in PNG metadata.
