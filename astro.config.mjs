import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://anibalribeiro.cz',
  trailingSlash: 'always',
  // The buy page is a noindex utility page, so it stays out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes('/FenixRunner/buy/') })],
});
