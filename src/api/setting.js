import request from '@/utils/request'

/**
 * 根据id查询企业
 * @param {*} companyId 企业id
 * @returns promise
 */
export function getCompanyInfoApi(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
