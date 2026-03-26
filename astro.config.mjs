// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    port: 3001,
  },
  vite: {
    server: {
      watch: {
        // Ignore SQLite DB changes to prevent HMR page reloads on login/register
        ignored: ['**/auth.db', '**/auth.db-journal', '**/auth.db-wal'],
      },
    },
  },
});
