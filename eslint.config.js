import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const rnPath = dirname(require.resolve('@react-native/eslint-config/package.json'));

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.config({
    overrides: [
      {
        files: ['**/*.ts', '**/*.tsx'],
        parserOptions: { ecmaVersion: 'latest' },
        extends: ['@react-native'],
      },
    ],
  }),
];
