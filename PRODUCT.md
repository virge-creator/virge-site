# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Virge's bilingual marketing site serves prospective clients and technical readers. The WFO demos specifically address network engineers and Workflow Orchestrator operators evaluating custom agents for service and network diagnostics.

## Product Purpose

Show what Virge builds through real implementations and recorded demonstrations, then provide documentation and a way to discuss an integration.

## Operating Context

Astro static website with English and Dutch routes. Four WFO scenarios share a detail component and appear as Demo cards in the Cases indexes: outage triage, monitoring alerts, packet loss and maintenance impact. A fifth card, the certificate lifecycle use case (`WfoUseCase.astro`), is a static illustrative scenario with no recording and a different execution boundary: its agents are read-only, and after a person approves, Workflow Orchestrator executes the renewal workflow. Its figures are rounded, services are generic categories with examples, and it names no organisation. Both diagrams render through `ServiceMap.astro`.

## Capabilities and Constraints

- Preserve existing technical claims, exact English prompts, recordings, routes, metadata and source links.
- Demonstrations use an emulated three-node SR Linux network. They assess and recommend; they do not execute repairs or maintenance changes.
- Stored WFO configuration and independently captured device measurements are different evidence sources. Preserve that distinction and any disagreement between samples.
- Recordings are silent, English and edited to compress waiting time. Desktop autoplay is muted and respects reduced motion; mobile playback is user initiated.
- English and Dutch pages have equivalent behavior and cross-link through the language menu.

## Brand Commitments

Retain Virge's name and logo. On 2026-11-09 the user restored the original navy/purple site palette and system typography for the WFO demos and their cards, while keeping the redesigned layout. Warm Noir with Sora headings and Manrope body text remains an inactive design alternative, documented with a real screenshot in PR #23. Other site surfaces retain their existing identity.

## Evidence on Hand

The source videos and posters are in `public/videos/wfo-demos/`; bilingual scenario text is in `src/data/wfo-demos.ts`. Architecture reflects the verified planner, A2A, MCP, WFO, NetBox and SR Linux connections. Demo-page guidance is in the adjacent `virge-agents/.claude/skills/demo-page/`.

Cases thumbnails use static, bilingual scenario diagrams for outage, interface alert, packet loss and planned maintenance. The user chose diagrams because miniature recording text did not explain the scenarios at card size. Actual recording stills remain the detail-page video posters; diagram packet symbols are illustrative and contain no measured percentages.

On 2026-11-10 the user extended that circular-icon and fine-line diagram style to the detail-page architecture. Its simple and technical views are combined into one responsive graph. Hover, keyboard focus or a tap exposes a node’s role and protocols; the graph preserves the request/proxy path, specialist tools and network-mcp’s separate access to WFO intent and SR Linux device evidence.

The requested logo variant identifies LibreChat, Workflow Orchestrator and NetBox with their actual service marks, while generic agents and tools retain Lucide icons.

## Product Principles

- Show the recording and specific diagnostic evidence first.
- Write directly for the technical audience, with honest limitations.
- Preserve content while improving hierarchy and reducing repeated containers.
- Make architecture and controls usable on phones and with a keyboard.
