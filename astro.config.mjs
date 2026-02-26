import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://virge.io',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
