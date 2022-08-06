import request from '@/utils/request'

/**
 * 查询企业的部门列表
 * @returns promise
 */
export const getDepartments = () => {
  return request({
    url: '/company/department'
  })
}

/**
 * 根据ID删除部门
 * @param {String} id 部门id
 * @returns promise
 */
export const delDepartment = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

/**
 * 新增部门
 * @param {Object} data code introduce manager name	pid
 * @returns promise
 */
export const addDepartment = (data) => {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}
