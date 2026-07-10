import { defineConfig } from 'astro/config';
import { remarkMermaid } from './src/lib/rehype-mermaid.mjs';

export default defineConfig({
  site: 'https://virge.io',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  markdown: {
    remarkPlugins: [remarkMermaid],
  },
});
