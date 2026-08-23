import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintPluginTailwindcss from 'eslint-plugin-tailwindcss';
import prettierConfig from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),

  eslintPluginTailwindcss.configs.recommended,

  {
    settings: {
      tailwindcss: {
        cssConfigPath: './app/globals.css',
      },
    },
    rules: {
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/no-custom-classname': 'warn',
    },
  },

  prettierConfig,
]);

export default eslintConfig;
