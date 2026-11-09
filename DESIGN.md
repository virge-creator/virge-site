---
name: Virge WFO Demos — Warm Noir
description: An opt-in, flat technical editorial system for WFO demo pages and their Cases cards.
colors:
  bg: "#292624"
  bg-card: "#34302d"
  bg-card-hover: "#3d3834"
  border: "#58524c"
  text: "#eae5df"
  text-muted: "#b8b0a7"
  accent: "#376dd9"
  link: "#9db8ee"
  action-hover: "#2c5fc4"
  white: "#fff"
typography:
  display:
    fontFamily: "Sora, 'Segoe UI', sans-serif"
    fontSize: "clamp(2rem, 3.8vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.16
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Sora, 'Segoe UI', sans-serif"
    fontSize: "1.45rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Sora, 'Segoe UI', sans-serif"
    fontSize: "1.35rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  detail:
    fontFamily: "Manrope, 'Segoe UI', sans-serif"
    fontSize: ".9rem"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Manrope, 'Segoe UI', sans-serif"
    fontSize: ".8rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  label: "4px"
  action: "6px"
  menu: "8px"
  frame: "12px"
spacing:
  half: ".5rem"
  three-quarter: ".75rem"
  base: "1rem"
  compact: "1.25rem"
  panel: "1.5rem"
  diagram: "1.75rem"
  section-mobile: "2rem"
  section: "2.75rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    rounded: "{rounded.action}"
    padding: ".8rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  disclosure-control:
    textColor: "{colors.text}"
    rounded: "{rounded.action}"
    padding: ".5rem .75rem"
  disclosure-control-hover:
    backgroundColor: "{colors.bg-card-hover}"
  demo-label:
    textColor: "{colors.text}"
    rounded: "{rounded.label}"
    padding: ".2rem .65rem"
  cases-card:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text}"
    rounded: "{rounded.frame}"
  findings-panel:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text}"
    rounded: "{rounded.frame}"
    padding: "1.5rem"
---

# Design System: Virge WFO Demos — Warm Noir

## Overview

**Creative North Star: "Warm Noir"**

A brown-charcoal field, bone text and restrained blue signals give WFO demonstrations the clarity of a technical evidence report. Flat surfaces, real recording imagery and open reading sections establish a calm, precise character. Fine rules distinguish related information without enclosing every paragraph.

This is a scoped visual world for the four bilingual WFO demo detail pages and their existing Cases cards. Detail pages opt in through `data-theme="warm-noir"`; individual cards use a local `warm-noir` scope. The surrounding Cases index and all other site surfaces retain the incumbent purple palette and system typography. This document does not establish a new site-wide default.

**Key Characteristics:**

- Warm dark neutrals with pale blue links and solid blue actions.
- Sora semibold headings paired with Manrope reading text.
- Flat frames, fine dividers and real evidence imagery.
- Responsive reading layouts and native disclosures and video controls.

Source authority: `src/styles/wfo-theme.css`, `src/components/WfoDemo.astro`, `src/components/WfoDemoSetup.astro`, `src/components/WfoDemoCards.astro`, and the scoped navigation overrides. Values below describe the completed implementation; token values in the frontmatter are normative.

## Colors

The palette combines warm charcoal and bone with a cool, quiet blue signal.

### Primary

- **Quiet Blue** (`accent`): solid integration action fill; the CSS `accent-btn` alias shares it.
- **Pale Blue** (`link`): readable links, ticket identifiers, diagram signals and focus outlines; the CSS `accent2` alias shares it.
- **Deep Action Blue** (`action-hover`): primary action hover fill.

### Neutral

- **Brown Charcoal** (`bg`): page ground and opaque detail navigation.
- **Warm Graphite** (`bg-card`): recording frames, findings, architecture and cards; the CSS `surface` alias shares it.
- **Raised Graphite** (`bg-card-hover`): disclosure and navigation hover state, without physical lift.
- **Warm Rule** (`border`): fine dividers and framing strokes.
- **Bone** (`text`): headings and primary reading text.
- **Warm Ash** (`text-muted`): supporting copy, captions and diagram connectors.
- **White** (`white`): text on the solid blue action and backing behind the original NetBox identity asset.

**The Scope Rule.** Apply this palette only inside the opted-in detail route or local WFO card; preserve the surrounding site's incumbent identity.

## Typography

**Display Font:** Sora, with Segoe UI and sans-serif fallbacks. Only semibold (600) is locally supplied.

**Body Font:** Manrope, with Segoe UI and sans-serif fallbacks. The locally hosted variable face supplies weights (400–700). Fonts and licenses live in `public/fonts/wfo-demos/`.

**Character:** compact geometric headings introduce open, readable supporting text. Balanced headings use slight negative tracking; metadata stays in ordinary sentence case. Ticket identifiers use tabular numerals.

### Hierarchy

- **Display:** the `display` role is the desktop detail heading, constrained to (24ch). At widths up to (900px), its size becomes `clamp(2rem, 5vw, 3rem)`; up to (600px), `clamp(1.85rem, 7.2vw, 2.5rem)`.
- **Headline:** the `headline` role introduces reading sections; it reduces to (1.3rem) on phones. Architecture headings use a slightly looser line height (1.4).
- **Title:** the `title` role is the Cases card heading; it reduces to (1.25rem) up to (600px). Findings headings are smaller (1.1rem).
- **Body:** the `body` role establishes the page base. Introductory copy uses line height (1.8) and a desktop measure of (54ch); supporting paragraphs use the `detail` role. Closing copy stays within (65ch).
- **Label:** the `label` role supports scenario metadata. Card metadata is smaller (.7rem); recording captions (.7rem) and the service strip (.65rem) remain supporting information. Disclosure summaries use (.9rem), weight (500), with a minimum height of (54px).

**The Two Faces Rule.** Use Sora 600 for headings and Manrope for reading and controls; small subordinate findings headings deliberately use Manrope with normal tracking.

## Layout

Detail content and its navigation/footer containers share a maximum width (1240px), with inherited horizontal gutters (1.5rem). The detail article starts with padding (2rem) and ends with (4rem); phones reduce these to (1.25rem) and (2.5rem). Repeated gaps and panel padding follow the frontmatter spacing scale rather than a rigid universal grid.

Desktop headings use two columns (1.45:1); the recording/findings row uses (2:1) with a gap (1.75rem). At (1050px) the latter narrows to (1.7:1) with a gap (1.25rem). At (900px) headings and recording stack, while findings briefly retain two internal columns. At (600px) findings, validation/questions and closing sections become single columns. Recording stays before findings in document order.

Long sections are separated by rules and generous vertical spacing, commonly (2.75rem), reducing to (2rem) on phones. Request text wraps within (70ch). Cards fill the existing Cases grid; their body padding reduces from (1.5rem) to (1.25rem) on phones.

Architecture uses a horizontal overview on desktop. At (700px), it becomes a vertical requester/planner flow above three specialist/system pairs; every overview node remains visible without horizontal scrolling. Only the expanded technical graph uses a contained horizontal scroll region.

## Elevation & Depth

Content surfaces have no decorative shadows, glows or gradients. Depth comes from warm tonal differences, one-pixel rules and distinct image frames. Detail navigation is opaque, without backdrop blur; dropdowns use a warm border and flat fill. The inherited flag icon's inset edge is an identity detail, not an elevation token.

**The Flat Finish Rule.** Use fill, border and readable hierarchy to express structure; keep content surfaces flat at rest and on hover.

## Shapes

Frames and substantial panels use the `frame` radius; actions and technical disclosure controls use `action`; language controls use `menu`; the detail Demo label and small service-logo backing use `label`. This is a restrained rounded-rectangle vocabulary, not a pill system. Recording and card previews retain a (16:9) aspect ratio. Cropping belongs to the real recording stills, with provenance retained alongside the source assets.

Dividers are fine strokes (1px). Focus uses a pale blue outline (2px), normally offset (5px); the architecture disclosure and scroll region use a slightly tighter offset (4px).

## Components

### Primary action

The integration link is a solid, compact action with white text, semibold Manrope (.9rem), minimum height (48px), an inline SVG arrow and the frontmatter padding/radius. Hover uses `action-hover`; the fill transition lasts (.18s ease-out). Keyboard focus retains the visible outline. There is no custom active animation.

### Disclosures

Exact-request and FAQ disclosures are native `details` elements with bottom rules and generous summary targets. A real inline plus SVG rotates (45deg) when open with a transition (.2s ease-out). Hover changes summary text to pale blue.

The architecture disclosure is a bordered compact control with a minimum height (44px). It changes between “Show technical details” and “Show overview”; opening it replaces the overview with the detailed graph. Hover changes its fill and border. On narrow screens the control returns to normal flow.

### Demo label

Scenario metadata uses a small, noninteractive Demo label. The detail version has a fine border and compact rounded shape; the Cases-card version is plain semibold text. It is metadata, not a filter or selectable chip.

### Cards / Containers

WFO Cases cards are whole-card links with a warm border, graphite fill and rounded clipping. Each has a distinct sourced recording still, heading, supporting copy, compact service identity strip and a divided “Watch demo” row. Hover changes only the border to pale blue; focus adds the outline. Findings use the same fill and frame radius with internal dividers distinguishing the outcome from the diagnosis. Reading sections remain open rather than becoming repeated panels.

### Navigation

Detail routes reuse the site's sticky navigation with the scoped opaque ground, warm borders, Manrope text and pale blue active indicators. Desktop dropdowns expose keyboard focus within. At (900px) navigation becomes a toggle-controlled stack with bounded vertical scrolling; service chevrons have targets of at least (44px), and language choices remain visible. Preserve route-aware active states and English/Dutch links.

### Recording and architecture

Video keeps native controls, a real preview still, a warm frame and honest supporting captions. Desktop playback starts muted only above (900px) and when reduced motion is not requested; smaller screens and reduced motion use user-initiated playback. The architecture planner has a small outlined blue tile (48px square), while specialists and systems use inline SVG symbols and text. The detailed graph repeats the warm palette and Manrope labels.

Reduced motion removes the implemented control/card transitions and smooth scrolling in the opted-in world. No new inputs or custom video controls are part of this system.

## Do's and Don'ts

### Do:

- **Do** apply Warm Noir through the existing opt-in route or local card scope.
- **Do** use the supplied Sora 600 and Manrope faces in both languages.
- **Do** preserve real recording imagery, original service identities and asset provenance.
- **Do** use tonal panels for grouped evidence and fine rules for open reading sections.
- **Do** retain native controls, visible keyboard focus and the mobile architecture overview.

### Don't:

- **Don't** promote this scoped world into a site-wide palette or typography default.
- **Don't** add purple chrome, gradients, ornamental shadows or hover lift to the redesigned surfaces.
- **Don't** replace the recording stills with fabricated interfaces or decorative illustrations.
- **Don't** turn every paragraph into another rounded panel.
- **Don't** treat the Demo label as an interactive filter or invent form fields for these surfaces.
