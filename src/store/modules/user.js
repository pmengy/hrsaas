import { login, getUserInfoApi, getUserDetailsApi } from '@/api/user'
import { setTokenTime } from '@/utils/auth'
import { resetRouter } from '@/router'

export default {
  namespaced: true,
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
    }
  },
  actions: {
    async getToken({ commit }, payload) {
      const res = await login(payload)
      commit('setToken', res)
      setTokenTime()
    },
    async getUserInfo({ commit }) {
      const userBaseInfo = await getUserInfoApi()
      const userDetail = await getUserDetailsApi(userBaseInfo.userId)
      commit('setUserInfo', { ...userBaseInfo, ...userDetail })
      // action 内部可以通过 return 将数据传出去 , 类似 .then 的 return
      return userBaseInfo
    },
    logout({ commit }) {
      commit('setToken', '')
      commit('setUserInfo', {})
      resetRouter()
      // 相当于全局commit
      commit('permission/setRoutes', [], { root: true })
    }
  }
}
