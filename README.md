# unplugin-link-redirect
打包器的yarn/npm/pnpm link指令支持

## 开发背景
开发react组件库时，使用了dumi，因此组件的node_modules中会带有react和router包。</br>
并且在组件库源码中，也有使用到react的hooks和router的相关api。</br>
当在项目中使用link命令开发组件库时，组件库下所有的目录都会被link，包括其自身的node_modules。</br>
此时开发环境进行打包的话，会产生报错，导致项目无法正常编译</br>


因此开发环境打包，打包到组件库时，因为组件库项目中的node_modules中存在react和react-router，会直接将它们和组件库打包在一起。</br>
而项目中本身也依赖了react和react-router，因此此时同时存在了两个react及react-router。</br>

## 原因分析
组件的hooks的报错：
```text
Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
You might have mismatching versions of React and the renderer (such as React DOM)
You might be breaking the Rules of Hooks
You might have more than one copy of React in the same app
```
router的api报错：相关api必须在 &lt;Router&gt; 组件内使用</br>

两者都属于同一种问题，即hooks和router api都必须在自身包所创建的实例中使用。</br>

webpack打包项目时，通常都是先从包自身的node_modules中寻找依赖，然后再逐级向上寻找。</br>
因为link，webpack会识别到组件库的node_modules，和其中的react和router包，然后将它们也打进去供组件库单独使用。</br>
此时项目中同时存在两个独立的react和router包。</br>
项目运行时，会先使用自己的包创建实例。当组件渲染时，内部会执行自己包中导出的hooks和router api。</br>
此时组件库的包并没有创建实例，而是在项目包的实例中执行，因此hooks和api会检测到并报错。</br>

而这个插件则是简单的将link包中所有的依赖，全部都重定向到项目的node_modules中，避免重复打包问题。
## 使用
``` typescript
import linkFix, { webpack, rollup, vite, esbuild } from 'unplugin-link-redirect'

export default {
  plugins: [
    linkFix.webpack({
     	links: ['你通过npm link关联的包', ...]
    }),
    webpack({
    	links: ['你通过npm link关联的包', ...]
    }}
  ]
}
```
