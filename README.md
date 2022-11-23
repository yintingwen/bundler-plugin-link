# unplugin-link-redirect
打包器的yarn/npm/pnpm link指令支持

## 开发背景
在开发react组件库时，使用了dumi和react-router，而duni依赖了react，因此组件库的node_modules中带有react包</br>
当该组件库使用link命令开发时，包自身的node_modules也是存在的，且在组件库使用到了 hooks 以及 router api。</br>
但webpack打包依赖时，通常都是先从包自身的node_modules中寻找，然后再逐级向上寻找。</br>
因此开发环境打包，打包到组件库时，因为组件库项目中的node_modules中存在react和react-router，会直接将它们和组件库打包在一起。</br>
而项目中本身也依赖了react和react-router，因此此时同时存在了两个react及react-router。</br>
但此时开发环境运行项目就会报错。

## 原因分析
组件的hooks的报错
```text
Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
You might have mismatching versions of React and the renderer (such as React DOM)
You might be breaking the Rules of Hooks
You might have more than one copy of React in the same app
```

router的api报错：相关api必须在 <Router> 组件内使用</br>

上面都属于同一个问题，即hooks和router api都必须在所属包的指定范围内使。而由于link，导致组件库内导入的react和router是另一个独立的包，并不是项目中的那个。因此执行时，会识别到自身并不在规定的使用范围内。</br>

而这个插件则是很简单的将指定的link包中所有的依赖，全部都重定向到了项目的node_modules中，避免上述问题

## 使用
``` typescript
// webpack
import linkFix from 'unplugin-link-redirect/webpack'
// vite
import linkFix from 'unplugin-link-redirect/vite'

export default {
  plugins: [
    linkFix({
      links: ['react', 'react-dom', 'react-router']
    })
  ]
}
```
