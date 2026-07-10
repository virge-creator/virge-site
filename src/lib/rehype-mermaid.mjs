import { visit } from 'unist-util-visit'
import { renderMermaid } from './mermaid-flow.mjs'

export function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'mermaid' || !parent) return
      const html = renderMermaid(node.value)
      if (html) parent.children[index] = { type: 'html', value: html }
    })
  }
}
