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
