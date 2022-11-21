# unplugin-link-fix
打包器的yarn/npm/pnpm link指令支持

在开发react组件库是，使用了dumi，而duni依赖了react，因此组件库的node_modules中带有react包</br>
当该组件库使用link命令开发时，包自身目录下的node_modules也是存在的，在组件库使用到了 hooks 以及 jsx必须导入React。</br>
但webpack打包依赖时，通常都是先从包自身的node_modules中寻找，然后再逐级向上寻找。</br>
因此开发环境打包时，组件库node_modules的react也会被打包，从而一个项目中存在两个react。</br>
当在项目中使用组件库的组件时，项目的react会发现组件内使用的hooks等并不属于自身，则会报错并阻止渲染。</br>
如果在组件库中使用到了react-router，也是同上。</br>

而这个插件则是很简单的将指定的link库中所有的依赖，全部都重定向到了项目的node_modules中，避免上述问题
