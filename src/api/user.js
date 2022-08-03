import request from '@/utils/request'

/**
 * 用户登录接口
 * @param {Object} data mobile password
 * @returns promise
 */
export function login(data) {
  return request({
    url: 'sys/login',
    method: 'POST',
    data
  })
}

/**
 * 获取用户信息
 * @returns promise
 */
export function getUserInfoApi() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * 根据用户id 获取员工基本信息
 * @param {String} id 用户id 
 * @returns promise
 */
export function getUserDetailsApi(id) {
  return request({
    url: '/sys/user/' + id
  })
}
