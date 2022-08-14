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

/**
 * 删除员工
 * @param {*} id 员工id
 * @returns promise
 */
export function delEmployeeApi(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

/**
 * 新增员工
 * @param {*} data
 * @returns promise
 */
export function addEmployeeApi(data) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

/**
 * 批量导入员工
 * @param {*} data 员工数组
 * @returns promise
 */
export function importEmployeeApi(data) {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}
