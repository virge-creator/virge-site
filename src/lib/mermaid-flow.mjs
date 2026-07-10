import { renderMermaidSVG } from 'beautiful-mermaid'

// ─── Theme ────────────────────────────────────────────────────────────────────
const VIRGE_THEME = { bg: 'transparent', fg: '#f5f0e8', accent: '#6c5ce7', muted: '#8884aa' }
const EXTRA_SVG_VARS = '--surface:rgba(108,92,231,0.13);--border:rgba(168,85,247,0.42);--line:rgba(108,92,231,0.55)'

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export function extractMeta(raw) {
  let label = null, note = null
  const lines = raw.split('\n').filter(line => {
    const t = line.trim()
    if (/^%%label:/i.test(t)) { label = t.replace(/^%%label:\s*/i, '').trim(); return false }
    if (/^%%note:/i.test(t))  { note  = t.replace(/^%%note:\s*/i,  '').trim(); return false }
    return true
  })
  return { label, note, source: lines.join('\n').trim() }
}

// ─── Node definition parser ───────────────────────────────────────────────────
function parseNodeDef(part) {
  const s = part.trim()
  const shapes = [
    [/^(\w+)\(\[([^\]]*)\]\)/, 2],
    [/^(\w+)\(\(([^)]*)\)\)/,  2],
    [/^(\w+)\[([^\]]*)\]/,     2],
    [/^(\w+)\(([^)]*)\)/,      2],
    [/^(\w+)\{([^}]*)\}/,      2],
  ]
  for (const [re, g] of shapes) {
    const m = s.match(re)
    if (m) {
      const raw = m[g].replace(/^["']|["']$/g, '') // strip optional mermaid quote delimiters
      return { id: m[1], label: raw.replace(/<br\s*\/?>/gi, '\n') }
    }
  }
  const m = s.match(/^(\w+)/)
  return m ? { id: m[1], label: null } : null
}

// ─── Mermaid source parser ────────────────────────────────────────────────────
export function parseMermaidFlow(source) {
  const lines = source.split('\n').map(l => l.trim()).filter(Boolean)
  if (!lines.length || !/^graph\s+/i.test(lines[0])) return null

  const dirMatch = lines[0].match(/^graph\s+(\w+)/i)
  const dir = dirMatch ? dirMatch[1].toUpperCase() : 'TD'

  const nodes = new Map()
  const edges = []

  for (const line of lines.slice(1)) {
    if (/^(classDef|class |style |click |subgraph|end$)/i.test(line)) continue
    if (line.includes('-->') || line.includes('---') || line.includes('==>')) {
      const stripped = line.replace(/\|[^|]*\|/g, '')
      const parts = stripped.split(/\s*(?:-->|---|==>)\s*/)
      for (let i = 0; i < parts.length; i++) {
        const n = parseNodeDef(parts[i])
        if (!n?.id) continue
        if (n.label !== null) nodes.set(n.id, n.label)
        else if (!nodes.has(n.id)) nodes.set(n.id, n.id)
        if (i < parts.length - 1) {
          const next = parseNodeDef(parts[i + 1])
          if (next?.id) edges.push([n.id, next.id])
        }
      }
    } else {
      const n = parseNodeDef(line)
      if (n?.id && n.label !== null) nodes.set(n.id, n.label)
    }
  }

  return { nodes, edges, dir }
}

// ─── Linear chain builder ─────────────────────────────────────────────────────
// Node labels with \n are split into: [actor], title, [desc]
export function buildLinearChain(nodes, edges) {
  if (!edges.length) return null
  const out = new Map(), inDeg = new Map()
  for (const [f, t] of edges) {
    if (out.has(f)) return null
    out.set(f, t)
    inDeg.set(t, (inDeg.get(t) || 0) + 1)
    if (inDeg.get(t) > 1) return null
  }
  const starts = [...new Set(edges.flat())].filter(id => !inDeg.has(id))
  if (starts.length !== 1) return null

  const chain = []
  let cur = starts[0]
  const seen = new Set()
  while (cur && !seen.has(cur)) {
    seen.add(cur)
    const raw = nodes.get(cur) || cur
    const parts = raw.split('\n')
    let actor = null, title, desc = null
    if (parts.length >= 3) {
      actor = parts[0]
      title = parts[1]
      desc = parts.slice(2).join(' ')
    } else if (parts.length === 2) {
      title = parts[0]
      desc = parts[1]
    } else {
      title = raw
    }
    chain.push({ id: cur, actor, title, desc })
    cur = out.get(cur)
  }
  return chain.length >= 2 ? chain : null
}

// ─── FlowDiagram-style HTML renderer ─────────────────────────────────────────
export function renderFlowHTML(label, note, chain, dir) {
  const isVertical = !dir || /^(TD|TB|BT)$/i.test(dir)
  const hasDesc    = chain.some(s => s.desc)
  const classes    = ['mermaid-flow-track', isVertical && 'is-vertical', hasDesc && 'has-desc']
    .filter(Boolean).join(' ')

  const noteHtml = note ? `<span class="mermaid-bar-note">${esc(note)}</span>` : ''

  const steps = chain.map((step, i) => {
    const actorHtml = step.actor ? `<span class="mermaid-step-actor">${esc(step.actor)}</span>` : ''
    const descHtml  = step.desc  ? `<p class="mermaid-step-desc">${esc(step.desc)}</p>` : ''
    const arrow     = i < chain.length - 1
      ? '<div class="mermaid-flow-arrow" aria-hidden="true"></div>'
      : ''
    return `<div class="mermaid-step"><div class="mermaid-step-num">${i + 1}</div><div class="mermaid-step-content">${actorHtml}<strong class="mermaid-step-title">${esc(step.title)}</strong>${descHtml}</div></div>${arrow}`
  }).join('')

  return `<div class="mermaid-diagram article-illustration"><div class="mermaid-bar"><span class="mermaid-bar-label">${esc(label)}</span>${noteHtml}</div><div class="${classes}">${steps}</div></div>`
}

// ─── SVG fallback ─────────────────────────────────────────────────────────────
export function renderSVGFallback(label, note, source) {
  let svg
  try {
    svg = renderMermaidSVG(source, VIRGE_THEME)
  } catch (err) {
    console.warn('[mermaid-flow]', err.message)
    return null
  }
  svg = svg.replace(/(<svg[^>]+style=")([^"]+)"/, (_, o, s) => `${o}${s};${EXTRA_SVG_VARS}"`)
  const noteHtml = note ? `<span class="mermaid-bar-note">${esc(note)}</span>` : ''
  return `<div class="mermaid-diagram article-illustration"><div class="mermaid-bar"><span class="mermaid-bar-label">${esc(label)}</span>${noteHtml}</div><div class="mermaid-body">${svg}</div></div>`
}

// ─── Main entry point ─────────────────────────────────────────────────────────
export function renderMermaid(raw) {
  const { label, note, source } = extractMeta(raw)
  const displayLabel = label ?? 'Diagram'
  const parsed = parseMermaidFlow(source)
  const chain  = parsed ? buildLinearChain(parsed.nodes, parsed.edges) : null
  return chain
    ? renderFlowHTML(displayLabel, note, chain, parsed.dir)
    : renderSVGFallback(displayLabel, note, source)
}
