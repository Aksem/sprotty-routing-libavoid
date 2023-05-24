import { build } from 'esbuild'

build({
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    bundle: true,
    sourcemap: true,
    minify: true,
    splitting: true,
    format: "esm",
    external: ["module"],
  })
  .catch(() => process.exit(1));
