// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTokenTime } from './auth'
import router from '@/router'

// 创建一个axios的实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 配置环境变量
  timeout: 5000
})

function isTimeout() {
  const currentTime = Date.now()
  const tokenTime = getTokenTime()
  const timeout = 2 * 60 * 60 * 1000
  return currentTime - tokenTime > timeout
}

// 请求拦截器
service.interceptors.request.use(async (config) => {
  if (store.state.user.token) {
    // 判断token是否过期
    if (isTimeout()) {
      await store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('登录过期'))
    } else {
      config.headers.Authorization = 'Bearer ' + store.state.user.token
    }
  }
  return config
})

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { success, data, message } = response.data
    if (success) {
      return data
    }
    Message.error(message)
    return Promise.reject(new Error(message))
  },
  async (error) => {
    if (error?.response?.status === 401) {
      Message.error('登录过期')
      await store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(error.message)
    }
    return Promise.reject(error)
  }
)
// 导出axios实例
export default service
