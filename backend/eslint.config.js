const js = require("@eslint/js");
const globals = require("globals");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.js"],
    ignores: ["src/tests/**"],
    languageOptions: { sourceType: "commonjs" },
  },
  {
    files: ["src/tests/**/*.js"],
    languageOptions: { sourceType: "module" },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
]);
