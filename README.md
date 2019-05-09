# ZCMS 3.0 二次开发脚手架
ZCMS3前端使用用Vue及ElementUI框架，后端实现RESTful规范的接口与前端进行交互。
下面列出二次开发涉及到的工具、框架或库，请先作学习了解：
* [x] **[VueJS 2.x](https://github.com/vuejs/vue)**
* [x] [Vue-router](https://github.com/vuejs/vue-router)
* [x] [axios](https://github.com/mzabriskie/axios)
* [x] **[Element UI 2.3.3](https://github.com/ElemeFE/element)**
* [x] [Babel](https://babeljs.io/)
* [x] [Webpack](https://github.com/webpack/webpack)
* [x] [gulp](https://gulpjs.com/)

## 开发流程：
1. 克隆本工程，可依需要调整目录结构、webpack配置。安装好依赖。得到zcms前端工程编译后的文件（有且不仅有 目录assets、images、lib……文件 common.js zcms.dll.js app.js login.js install.js ……），将zcms前端工程文件（已编译）都放在本工程`static`目录（本工程没有该目录，则新建一个）下。
1. 在从`static`目录下复制index.html到`src`目录下
1. 在`src`目录下建立项目的入口js，例如`project.js`
1. 在从`src`目录下复制index.html的最后添加对`project.js`的引用
1. 根据项目实际需求，并通过`app.insertMenu`方法增加菜单和路由配置，准备各路由所对应的vue文件，vue文件内容为空白，待分配给项目成员实现。
1. 在mock目录下准备mock数据，设计好数据结构（控件需要的数据结构）和字段名（最好同数据库中表结构字段名）
1. 实现vue文件的界面部分，使用`axios-mock-adapter`来拦截ajax请求，返回mock数据。
1. 后端实现RESTful接口，并维护接口文档（在doc目录下维护Swagger格式接口文档或使用 http://apizza.cc 在线文档服务）
1. 前端取消`axios-mock-adapter`拦截，调试后端接口。

### 修改现有功能
1. 向产品组要求提供要修改的功能的vue组件源码，产品组会使用脚本对要导出的vue组件进行处理，重设组件中的依赖，
2. 产品组提供的vue组件源文件的基础上可随意修改，添加新功能，
3. 在入口js里引用这些修改后的vue组件，编译后，在网页中执行时，修改后的组件会将原来的组件功能覆盖掉

#### vue组件修改原理
1. 在ZCMS工程，使用`webpack`打包时，会使用到我们自己开发的`babel`插件`babel-plugin-for-zving-project`，会将即所有的vue组件组织到zving命名空间下，以便作二次开发时可以覆盖。

```js
// 假设这个vue组件路径为 src/views/dirname/curcompname.vue
import foo from './compname.vue'
import {bar, baz} from '../../libname.js'

export default {
  data(){
    return {}
  }
}
```

转换为下面这种写法

```js
import foo from './compname.vue'
import {bar, baz} from '../../libname.js'

window.namespace('zving.views.dirname.curcompname')
export default zving.views.dirname.curcompname = {
  data(){
    return {}
  }
}
```

2. 项目组向产品组要求提供vue组件源码时，产品组会使用脚本getSourceForSecondaryDevelopment.js对要导出的vue组件源码进行处理，重设组件中的依赖，并且用新的组件定义覆盖原来的定义

```js
// 假设这个vue组件路径为 src/views/dirname/curcompname.vue
import foo from './compname.vue'
import {bar, baz} from '../../libname.js'

export default {
  data(){
    return {}
  }
}
```

转换为下面这种写法

```js
const foo = zving.views.dirname.compname
const {bar, baz} = zving.lib.libname

window.namespace('zving.views.dirname.curcompname')
export default zving.views.dirname.curcompname
Object.assign(zving.views.dirname.curcompname, {
  data(){
    return {}
  }
})
```

### 添加菜单和路由
给全局对象`VueRouter`添加了两个静态方法，`insertMenu`和`insertSubMenus`，在监听到`document`的`appbeforeinstantiaterouter`事件后可以调用。  
`VueRouter.insertMenu`方法可以添加一级菜单和路由；  
`VueRouter.insertSubMenus`方法可以添加二级菜单和路由；  
**注意**只有如果路由的`meta`配置里有`title`，才会添加菜单。示例代码如下：
```js
const menuConfig = {
  path: '/subject1',
  name: 'subject1',
  meta: { title: '一级菜单', icon: 'fa fa-desktop' },
  component: require('./views/subject1/index.vue').default,
  children:[
    {
      path: '/subject1/view1',
      meta: {title: '二级菜单1', icon: 'fa fa-cog'},
      component: require('./views/subject1/subview1.vue').default
    },
    {
      path: '/subject1/view2',
      meta: {title: '二级菜单2', icon: 'fa fa-cog'},
      component: require('./views/subject1/subview1.vue').default
    },
    {
      path: '/subject1/view3',
      meta: {title: '二级菜单3', icon: 'fa fa-cog'},
      component: require('./views/subject1/subview1.vue').default
    }
  ]
}

document.addEventListener('appbeforeinstantiaterouter', e => {
  VueRouter.insertMenu(menuConfig, 4)
}, false)
```

```js
const subMenusConfig = [
  {
    path: '/member/view1',
    meta: { title: '添加子菜单1', icon: 'fa fa-cog' },
    component: require('./views/subject1/subview1.vue').default
  },
  {
    path: '/member/view2',
    meta: { title: '添加子菜单2', icon: 'fa fa-cog' },
    component: require('./views/subject1/subview1.vue').default
  },
  {
    path: '/member/view3',
    meta: { title: '添加子菜单3', icon: 'fa fa-cog' },
    component: require('./views/subject1/subview1.vue').default
  }
]

document.addEventListener('appbeforeinstantiaterouter', e => {
  VueRouter.insertSubMenus(subMenusConfig, '/member', 3)
}, false)
```

## 注意事项
1. JS风格使用`JavaScript Standard Style`，建议使用VSCode作为js/vue的编辑器，并安装以下插件`EditorConfig for VSCode`,`Prettier-Standard - JavaScript formatter`,`JavaScript Standard Style`,`stylefmt`,`Vetur`。  
    并且vscode的配置里要加下面的命令，防止格式化时自动加分号。   
    `  "prettier.singleQuote": true,`  
    `  "prettier.semi": false,`  
1. 在开发界面时使用ElementUI提供的栅格系统（24列），对界面进行响应式布局，以便移动端访问。
1. 不要使用ElementUI提供的图标组件，使用Font Awesome 图标。
1. 后端接口符合RESTful规范
1. 工程编译时，`static`目录下的文件会被直接复制到`dist`目录下，注音`src`目录下的文件和`static`目录下的的文件不要同名。
1. 为了便于维护，对话框、页签等如果里面的内容比较多（超过30行），要独立成vue组件，尽量不要让一个vue组件的代码太多（超过500行超过20K）,尽量把vue文件里的js移到单独的文件，便于使用编辑器的js校验/js格式化功能。vue文件中css代码行数较多时（超过50行），亦可将css移到单独的css文件。模板部分要保持在vue文件里，以使用Vetur插件的模板语法校验功能。
1. 从后台请求的数据有分页的情况下，Request参数的约定：`pageIndex` 第几页（从第1页开始）；`pageSize` 每页返回多少行。Response中返回数据除了有列表外，还要有`total`供分页条显示总记录数。
1. 因为ElementUI 2.3.4 对 pagination.js 的调整，使之翻页条初始化时会翻到第1页，需要重新封装有翻页条的表格，在此之前不要升级ElementUI。

### 浏览器兼容性要求
- IE9+（支持Vue2 不支持MutationObserver）能使用基本功能
- IE11+（支持Vue2 支持MutationObserver 支持Promise等ES6特性；不支持箭头函数等ES6特性、不支持录音，不支持IndexedDB）/Chrome45+（支持Vue2 支持MutationObserver 支持File； 不支持ES6、不支持录音），能使用大部分功能
- Chrome54+（支持ES6 支持async等ES7特性），所有功能可以使用

## 目录说明
目录结构类似 https://github.com/kenberkeley/vue-demo/tree/master/src 但有简化、调整。

```
static
├─lib                      第三方库，供页面用<script>引入，不会编译，直接复制到发布目录
│      vue.min.js
│      vue-router.min.js
│      axios.min.js
│      ......
├─assets                   资源目录，不会编译，直接复制到发布目录
│  ├─css                   公共样式及第三方样式库，页面用<link>引入
│  ├─fonts                 图标字体
│  └─images                图片
src
│  index.html              主入口静态页
│  project-app.js                  主入口js
│  login.html              登录页静态页
│  project-login.js                登录页js
│  config.js               一些全局配置
│  
├─router                   路由配置
├─directives               自定义指令
├─filters                  自定义过滤器
├─mixins                   公共mixins
├─common                   公共js工具方法/类
│      util.js               工具类
│      ......
├─components               公共组件
│      toolbar.vue
│      ......
└─views                    所有页面视图
   │   app.vue                app主视图组件
   │
   ├─workspace                对应一级菜单“我的工作台”
   │      ......
   ├─plugins                  对应一级菜单“功能组件”
   │  ├─components            “功能组件”模块下各子模块的共用组件
   │  ├─mixins                “功能组件”模块下各子模块的共用mixins
   │  └─mock                  mock数据目录
   │  ............
   ├─member                   对应一级菜单“会员管理”
   │  ├─components            “会员管理”模块下各子模块的共用组件
   │  ├─mixins                “会员管理”模块下各子模块的共用mixins
   │  └─mock                  mock数据目录
   │  ............
   └─error                    404、505等错误提示视图
```

## 开发与构建命令
建议使用`yarn`最新版本，下载地址 https://yarnpkg.com/latest.msi  
建议使用淘宝的npm仓库镜像，安装npm包速度更快：  
``` bash
# 使用淘宝的npm仓库镜像   
npm config set registry https://registry.npm.taobao.org

```

``` bash
# 安装依赖   
yarn install

# 进入开发模式，启动前台应用，localhost:3000 。监听vue文件改动自动刷新浏览器  
yarn run dev

# 构建文件到dist目录供发布  
yarn run build

```

## 链接
JavaScript Standard 代码规范  
https://github.com/standard/standard/blob/master/docs/README-zhcn.md  

VUE 2 文档  
https://cn.vuejs.org/v2/api/  

Vue Router 2 文档  
https://router.vuejs.org/zh-cn/  

Element-UI 文档  
http://element.eleme.io/#/zh-CN/component/layout  

axios 介绍  
https://github.com/mzabriskie/axios/blob/master/README.md  

Font Awesome 图标  
~~http://fontawesome.io/icons/~~  
https://www.thinkcmf.com/font/font_awesome/icons.html   

Swagger 文档  
https://swagger.io/docs/specification/basic-structure/  
