import typescript from "rollup-plugin-typescript2";

export default {
    input: {
      index: "src/index.ts",
      rollup: "src/rollup.ts",
      webpack: "src/webpack.ts",
      esbuild: "src/esbuild.ts",
      vite: "src/vite.ts",
    },
    output: [
      {
        dir: "dist",
        entryFileNames: '[name].js',
        format: 'esm'
      },
      {
        dir: "dist",
        entryFileNames: '[name].cjs',
        format: 'cjs'
      }
    ],
    plugins: [typescript()]
}

