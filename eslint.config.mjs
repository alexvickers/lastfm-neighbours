import eslintPluginNext from 'eslint-plugin-next';
import js from '@eslint/js';
import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends([
    'next/core-web-vitals',
  ]),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['.next/', 'node_modules/', 'dist/', 'out/'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      next: eslintPluginNext,
    },
    rules: {
      // Regras personalizadas aqui, se quiser
    },
  },
];
