import { createUnplugin } from 'unplugin'
import path from 'path'

const plugin = createUnplugin((options, meta) => {
    return {
        name: 'bundler-plugin-link',
        resolveId (id, importer) {
            if (importer && importer.indexOf('@time/core-ui') !== -1 && importer.match(/node_modules/g).length === 1 && id && /^[a-z|-]+$/i.test(id)) {
                return path.resolve(process.cwd(), `node_modules/${id}`)
            }
            return null
        }
    }
})

export default plugin
export const webpack = plugin.webpack
export const rollup = plugin.rollup
export const vite = plugin.vite
export const esbuild = plugin.esbuild
