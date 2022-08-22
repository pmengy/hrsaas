import router, { constantRoutes, asyncRoutes } from '@/router'
export default {
  namespaced: true,
  state: {
    // 自己维护的路由规则
    routes: [],
    points: []
  },
  mutations: {
    setRoutes(state, routes) {
      state.routes = [...constantRoutes, ...routes]
    },
    setPoints(state, points) {
      state.points = points
    }
  },
  actions: {
    filterRoutes({ commit }, roles) {
      // 将可以访问的路由筛选出来
      const routes = asyncRoutes.filter((item) => {
        return roles.menus.includes(item.meta.id)
      })
      commit('setRoutes', routes)
      // 把404放在最后
      router.addRoutes([
        ...routes,
        { path: '*', redirect: '/404', hidden: true }
      ])
    },
    setPointsAction({ commit }, points) {
      commit('setPoints', points)
    }
  }
}
