# WFO demo design reference

`wfo-warm-noir-sora-manrope.png` shows the redesigned demo page with the optional **Warm Noir** palette, **Sora 600** headings and **Manrope** body text. The current demo pages use the original site's navy/purple palette and system typography; the redesigned layout and recording previews remain.

The image is a real full-page Chromium screenshot of `/en/cases/wfo-outage-triage/` at a 1440 × 1000 viewport, captured on 2026-11-09 from commit `c849c78f` with reduced motion enabled. It is an archived design alternative for PR #23, not a screenshot of the current default appearance. No generated imagery or interface edits were used.

## Current WFO scenario thumbnails

`wfo-scenario-thumbnails.png` shows the four current WFO Cases cards in the original navy/purple theme with system typography. Their static diagrams distinguish service outage, interface alert, packet loss and planned maintenance. The detail-page video posters still use real recording frames.

Captured from `/en/cases/` on 2026-11-09 at 1440px viewport width, with the document painted at 2733px height to avoid off-screen screenshot artifacts. The browser-cropped card region is 1052 × 1278px. PNG metadata records the source route and hashes of the component/data files; the captured pixels were not edited. Packet symbols are illustrative rather than a measured sample. No generated imagery was used.

## Cases index and WFO demo overview

The four `cases-overview-en-{desktop,mobile}.png` and `wfo-demo-overview-en-{desktop,mobile}.png` screenshots show the current English `/en/cases/` and `/en/cases/wfo-demos/` pages. The Cases index now links through a WFO × agent card; the dedicated overview contains the four scenario cards previously shown on Cases. The earlier scenario-thumbnail capture above records their previous location.

Captured on 2026-11-09 from the final local source with Chromium at 1440px (desktop) and 390px (mobile) widths, with reduced motion enabled. Full document heights were painted before capture to avoid off-screen artifacts; the Astro development toolbar was hidden. These are unedited browser screenshots of the original navy/purple theme. The WFO badge has 4px corners; the dark agent icon sits in a rounded purple outline on white.
