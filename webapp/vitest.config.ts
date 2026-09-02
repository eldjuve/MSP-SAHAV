import { defineConfig } from 'vitest/config';

// Deliberately standalone from vite.config.ts: nothing here renders a Solid
// component (no vite-plugin-solid/JSX transform needed), just plain TS
// units — mapStore/uiStore's module-level createSignal calls work fine
// under plain Node/jsdom without it.
export default defineConfig({
  test: {
    environment: 'jsdom',
  },
});
