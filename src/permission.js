import router from '@/router'
import store from '@/store'
// 全局前置路由守卫
// to: 要去哪里
// from: 来自哪里
// next:
const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  if (token) {
    if (!store.state.user.userInfo.userId) {
      store.dispatch('user/getUserInfo')
    }
    to.path === '/login' ? next('/') : next()
  } else {
    whiteList.includes(to.path) ? next() : next('/login')
  }
  // token
  //   ? to.path === '/login'
  //     ? next('/')
  //     : next()
  //   : whiteList.includes(to.path)
  //   ? next()
  //   : next('/login')
})
