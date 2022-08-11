import request from '@/utils/request'

/**
 * 获取员工简单列表
 * @returns promise
 */
export const getEmployeesApi = () => {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 获取员工列表
 * @param {*} params
 * @returns promise
 */
export const getEmployeesInfoApi = (params) => {
  return request({
    url: '/sys/user',
    params
  })
}
