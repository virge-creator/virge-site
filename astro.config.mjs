import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkMermaid } from './src/lib/rehype-mermaid.mjs';

export default defineConfig({
  site: 'https://virge.io',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Root / is a language-detecting redirect to /en/ or /nl/ — keep it out of the sitemap
      // Thank-you pages are noindex and only reached after a form or Stripe checkout
      filter: (page) => page !== 'https://virge.io/' && !page.includes('/seo/thanks/'),
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
