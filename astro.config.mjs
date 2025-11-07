import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://napolitain.github.io',
  base: '/gameplanner',
  integrations: [svelte(), tailwind()],
});
