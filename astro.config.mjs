import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkMermaid } from './src/lib/rehype-mermaid.mjs';

export default defineConfig({
  site: 'https://virge.io',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Root / is a meta-refresh redirect to /en/ — keep it out of the sitemap
      filter: (page) => page !== 'https://virge.io/',
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', nl: 'nl-NL' },
      },
    }),
  ],
  build: {
    format: 'directory',
  },
  markdown: {
    remarkPlugins: [remarkMermaid],
  },
});
