// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入 Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入本地缓存js
import store from './store'

Vue.config.productionTip = false
// 使用ElementUI
Vue.use(ElementUI)

// 设置反向代理，前端请求默认发送到 http://localhost:8843
var axios = require('axios')
axios.defaults.baseURL = 'http://localhost:8845'
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios
// 为了让前端能够带上 cookie，我们需要通过 axios 主动开启 withCredentials 功能
axios.defaults.withCredentials = true

// 使用钩子函数判断是否拦截,钩子函数判断是否拦截,钩子函数及在某些时机会被调用的函数。这里我们使用 router.beforeEach()，意思是在访问每一个路由前调用. 放在new Vue 之前，不然直接访问页面，没有拦截调用问题
router.beforeEach((to, from, next) => {
  console.log('store.state.user.username=====' + store.state.user.username)
  if (store.state.user.username && to.path.startsWith('/admin')) {
    initAdminMenu(router, store)
  }
  // 已登录状态下访问 login 页面直接跳转到后台首页
  if (store.state.username && to.path.startsWith('/login')) {
    next({
      path: 'admin'
    })
  }

  // debugger
  if (to.meta.requireAuth) {
    if (store.state.user) {
      axios.get('/api/authentication').then(resp => { // 防止前端通过伪造参数，绕过前端的路由限制，访问本来需要登录才能访问的页面
        if (resp) next()
      })
    } else {
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

const initAdminMenu = (router, store) => {
  console.log(store.state.adminMenus.length)
  axios.get('/menu').then(resp => {
    console.log(resp)
    if (resp && resp.status === 200) {
      var fmtRoutes = formatRoutes(resp.data)
      router.addRoutes(fmtRoutes)
      store.commit('initAdminMenu', fmtRoutes)
    }
  })
}

const formatRoutes = (routes) => {
  let fmtRoutes = []
  routes.forEach(route => {
    if (route.children) {
      route.children = formatRoutes(route.children)
    }

    let fmtRoute = {
      path: route.path,
      component: resolve => {
        // debugger
        console.log(route.component)
        require(['@/components/admin/' + route.component + '.vue'], resolve)
      },
      name: route.name,
      nameZh: route.nameZh,
      iconCls: route.iconCls,
      children: route.children
    }
    fmtRoutes.push(fmtRoute)
  })
  return fmtRoutes
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  // 注意这里
  store,
  components: { App },
  template: '<App/>'
})
