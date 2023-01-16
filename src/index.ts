import { createUnplugin } from 'unplugin'
import path from 'path'
import * as fs from "fs";

const libaReg = /^[a-zA-Z0-9|-]+$/
const nodeModulesReg = /node_modules/g
const rootPackageVersion: Record<string, string> = {}
const selfPackageVersion: Record<string, Record<string, string>> = {}

export interface UnpluginLinkRedirectOptions {
  links: string[]
}

const unpluginLinkRedirect = createUnplugin((options: UnpluginLinkRedirectOptions) => {
  const links = (options.links || []).map(path.normalize)

  return {
    name: 'unplugin-link-redirect',
    resolveId (id, importer) {
      // 没有配置links，没有id，没有importer，id不是一个node_modules中的包
      if (!links.length || !id || !importer || !libaReg.test(id)) return null
      // 导入者文件是需要修复的包
      const redirectLink = links.find(link => importer.includes(link) && importer.match(nodeModulesReg)?.length === 1)
      if (!redirectLink) return null

      // 根node_modules的version是否在缓存map中，不是则读取package.json
      if (!rootPackageVersion[id]) {
        const rootPackageJson = getPackageJson(id, path.resolve())
        if (rootPackageJson) {
          rootPackageVersion[id] = rootPackageJson.version
        }
      }
      // 导入者node_modules的version是否在缓存map中，不是则读取package.json
      let linkPackageVersion = selfPackageVersion[redirectLink] || (selfPackageVersion[redirectLink] = {})
      if (!linkPackageVersion || !linkPackageVersion[id]) {
        const selfPackageJson = getPackageJson(id, path.resolve('node_modules', redirectLink))
        if (selfPackageJson) {
          linkPackageVersion[id] = selfPackageJson.version
        }
      }
      // 根node_modules的version和导入者node_modules的version一致，返回根node_modules的路径
      // 如果 导入者或根 node_modules下没有这个id，就是undefined，比对就失败了，无法进入if直接返回null，走原本逻辑
      if (rootPackageVersion[id] === selfPackageVersion[redirectLink][id]) {
        return path.resolve('node_modules', id)
      }
      return null
    }
  }
})

function getPackageJson (id: string, rootPath: string = ''): Record<string, any> | null {
  const selfPackagePath = path.join(rootPath, 'node_modules', id)
  const selfHasLib = fs.existsSync(selfPackagePath)
  if (!selfHasLib) return null
  const selfPackageJsonPath = path.join(selfPackagePath, 'package.json')
  return JSON.parse(fs.readFileSync(selfPackageJsonPath, 'utf-8'))
}

export const webpack = unpluginLinkRedirect.webpack
export const rollup = unpluginLinkRedirect.rollup
export const vite = unpluginLinkRedirect.vite
export const esbuild = unpluginLinkRedirect.esbuild
export default unpluginLinkRedirect
