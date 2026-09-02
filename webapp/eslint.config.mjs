import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import solid from 'eslint-plugin-solid/configs/typescript';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    ...solid,
  },
  // Disables stylistic rules that would otherwise conflict with Prettier —
  // keep this last so it can override anything above it.
  prettier,
  {
    rules: {
      // Leaflet/ECharts callback signatures often have parameters this app
      // doesn't need (e.g. an unused event object) — allow an explicit
      // `_`-prefixed name to opt out rather than banning unused args outright.
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // False positive on `let x!: T` declared for later assignment via a
      // ref (Solid's `ref={x}` idiom, e.g. ChartContainer.tsx) or a
      // callback closure (e.g. a deferred promise's resolve) — this rule's
      // static analysis doesn't trace either.
      'no-unassigned-vars': 'off',
    },
  },
);
