import { login, getUserInfoApi, getUserDetailsApi } from '@/api/user'
import { setTokenTime } from '@/utils/auth'

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
    },
    logout({ commit }) {
      commit('setToken', '')
      commit('setUserInfo', {})
    }
  }
}
