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

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/**
 * 给员工分配角色
 * @param {*} data id roleIds
 * @returns promise
 */
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'PUT',
    data
  })
}
