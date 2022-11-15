import typescript from "rollup-plugin-typescript2";
import cleanup from "rollup-plugin-cleanup";

export default {
    input: {
      index: "src/index.ts",
      webpack: "src/webpack.ts",
      rollup: "src/rollup.ts",
      esbuild: "src/esbuild.ts",
      vite: "src/vite.ts"
    },
    output: [
      {
        dir: "dist",
        entryFileNames: '[name].mjs',
        format: 'esm'
      },
      {
        dir: "dist",
        entryFileNames: '[name].js',
        format: 'cjs'
      }
    ],
    external: ["fs", "path", "unplugin"],
    plugins: [ cleanup(), typescript()]
}

