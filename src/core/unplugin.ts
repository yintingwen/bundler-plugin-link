import { createUnplugin } from 'unplugin'
import path from 'path'
import * as fs from "fs";

const libaReg = /^[a-zA-Z0-9|-]+$/
const nodeModulesReg = /node_modules/g

export interface UnpluginLinkFixOptions {
  links: string[]
}

const unpluginLinkFix = createUnplugin((options: UnpluginLinkFixOptions) => {
  const { links = [] } = options

  return {
    name: 'unplugin-link-fix',
    resolveId (id, importer) {
      // 没有id，没有importer，id不在修复列表中，id不是一个包)
      if (!links.length || !id || !importer || !links.includes(id) || !libaReg.test(id)) return null
      const isFixLib = links.some(link => importer.includes(link)) && importer.match(nodeModulesReg)?.length === 1
      const rootHasLib = fs.existsSync(path.resolve('node_modules', id))
      if (isFixLib && rootHasLib) {
        return path.resolve('node_modules', id)
      }
      return null
    }
  }
})

export default unpluginLinkFix
