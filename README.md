# unplugin-link-fix
打包器的yarn/npm/pnpm link指令支持

## 开发背景
在开发react组件库时，使用了dumi和react-router，而duni依赖了react，因此组件库的node_modules中带有react包</br>
当该组件库使用link命令开发时，包自身的node_modules也是存在的，且在组件库使用到了 hooks 以及 router api。</br>
但webpack打包依赖时，通常都是先从包自身的node_modules中寻找，然后再逐级向上寻找。</br>
因此开发环境打包，打包到组件库时，因为组件库项目中的node_modules中存在react和react-router，会直接将它们和组件库打包在一起。</br>
而项目中本身也依赖了react和react-router，因此此时同时存在了两个react及react-router。</br>
进行渲染时，使用到了那些组件，会产生以下问题
1.react识别到其中的hooks并不属于自身，无法正常执行，从而报错并无法渲染，
2.react-router是单例的，识别到其内部的api并不属于自身，也会报错从而无法渲染

当在项目中使用组件库的组件时，项目的react会发现组件内使用的hooks等并不属于自身，则会报错并阻止渲染。</br>
如果在组件库中使用到了react-router，也是同上。</br>

而这个插件则是很简单的将指定的link库中所有的依赖，全部都重定向到了项目的node_modules中，避免上述问题

## 使用
``` typescript
// webpack
import linkFix from 'unplugin-link-fix/webpack'
// vite
import linkFix from 'unplugin-link-fix/vite'

export default {
  plugins: [
    linkFix({
      links: ['react', 'react-dom', 'react-router']
    })
  ]
}
```
