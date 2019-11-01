module.exports = {
  mode: "modules",
  target: "es6",
  out: "docs",
  exclude: ["**/node_modules/**", "**/*.spec.ts", "**/*.test.ts"],
  lernaExclude: [],
  name: "Google Maps JavaScript API v3 Utilities",
  excludePrivate: true,
  skipInternal: true,
  ignoreCompilerErrors: true,
  module: "commonjs",
  categorizeByGroup: true,
  readme: "./README.md"
};
