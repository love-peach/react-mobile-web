# react-mobile-web

主要目的：搭建一个 react 移动端项目，做到具有一定通用性，类似于模板的架子。

## TODOLIST

- [ ] 目录梳理
- [ ] 路由处理
- [ ] 布局模板
- [x] 自适应REM
- [x] Scss 全局变量
- [x] px2rem
- [ ] 数据缓存
- [ ] iconfont
- [ ] 动态加载
- [ ] 骨架加载预览

## 路由问题记录

`react-router-dom` 模块好像没有 `Router` 组件，之所以可以这么写 `<Router>...</Router>` 是因为 `{ BrowserRouter as Router } from "react-router-dom"` 这种写法，是给 `BrowserRouter` 组件 设置刘别名，所以可以那么些。下面讲的 `Router` 一般是指 `BrowserRouter`;

> A <Router> may have only one child element

`<Router>` 组件只能有一个跟标签。

> You should not use <Link> outside a <Router>

`Link` 组件必须在 Router 组件内调用。

react-router 中有三种类型的组件：

## react-router

### 分类

1、路由器组件

每个React Router应用程序的核心应该是路由器组件。对于Web项目，react-router-dom 提供 `<BrowserRouter>` 和 `<HashRouter>` 路由器。

一般来讲，如果你有一台相应请求的服务器，那么使用 `<BrowserRouter>`；如果你使用的是静态服务器，那么用 `<HashRouter>`。

2、路由匹配组件

有两个路由匹配组件 `<Route>`, `<Switch>`。`<Route>` 根据 `pathname` 匹配到路由，就显示相应的组件。如果有多个匹配，就显示多个。如果没有 `path` 属性，就始终渲染。

`<Switch>` 组件用于将 `<Route>` 组合在一起。它的作用是 渲染匹配到的第一个组件。

3、导航组件。

`Link` 相当于链接，导航到对应的路由中。
`Redirect` 重定向


