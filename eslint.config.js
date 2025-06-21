const js = require("@eslint/js");
const globals = require("globals");
const { defineConfig } = require("eslint/config");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const reactRefresh = require("eslint-plugin-react-refresh");

module.exports = defineConfig([
  {
    files: ["**/*.{js,jsx}"],
    ignores: ["server/**", "dist/**", "eslint.config.js", "server.js"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "19.1" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["server/**/*.{js,mjs,cjs}", "eslint.config.js", "server.js"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["server/**/*.js", "eslint.config.js", "server.js"],
    ignores: ["src/tests/**"],
    languageOptions: { sourceType: "commonjs" },
  },
  {
    files: ["server/tests/**/*.js"],
    languageOptions: { sourceType: "module" },
  },
  {
    files: ["server/**/*.{js,mjs,cjs}", "eslint.config.js", "server.js"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
]);
