module.exports = {
  mode: "modules",
  target: "es6",
  out: "docs",
  exclude: ["**/node_modules/**", "**/*.spec.ts", "**/*.test.ts"],
  lernaExclude: [],
  name: "@googlemaps",
  pathExclude: ["**/canvaslayer/**"],
  excludePrivate: true,
  skipInternal: true,
  ignoreCompilerErrors: true,
  module: "commonjs"
};
