// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // enables type-aware rules
  prettier, // turn off style rules that conflict with Prettier
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true, // uses your tsconfig.json
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      /* TypeScript “pit of success” */
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      /* React */
      'react/jsx-no-useless-fragment': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /* Import hygiene */
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    ignores: ['dist', 'coverage', 'node_modules'],
  },
];
