import request from '@/utils/request'

/**
 * 获取所有角色列表
 * @param {Object} params page pageSize
 * @returns promise
 */
export function getRolesApi(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * 添加角色
 * @param {Object} data name description
 * @returns promise
 */
export function addRoleApi(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

/**
 * 根据ID删除角色
 * @param {*} id 角色id
 * @returns promise
 */
export function removeRoleApi(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}
