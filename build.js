const esbuild = require("esbuild");

const { sassPlugin } = require("esbuild-sass-plugin");

const baseConfig = {
  entryPoints: ["src/index.js"],
  outdir: "dist",
  bundle: true,
  sourcemap: true,
  plugins: [sassPlugin()],
};

Promise.all([
  // 한번은 cjs
  esbuild.build({
    ...baseConfig,
    format: "cjs",
    outExtension: {
      ".js": ".cjs",
    },
  }),

  // 한번은 esm
  esbuild.build({
    ...baseConfig,
    format: "esm",
  }),
]).catch(() => {
  console.log("Build failed");
  process.exit(1);
});
