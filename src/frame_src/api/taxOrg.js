import request from '@/frame_src/utils/request'

export function getTaxOrgList(query) { // 根据Code查询组织机构配置
  return request({
    url: '/TaxOrg/getTaxOrgList',
    method: 'get',
    params: query
  })
}

export function createTaxOrg(data) {
  return request({
    url: '/TaxOrg/createTaxOrg',
    method: 'post',
    data
  })
}

export function updateTaxOrg(data) {
  return request({
    url: '/TaxOrg/updateTaxOrg',
    method: 'post',
    data
  })
}
export function deleteTaxOrg(data) {
  return request({
    url: '/TaxOrg/deleteTaxOrg',
    method: 'post',
    params: data
  })
}

export function getAllDictionary(query) { // 查询全部字典下拉
  return request({
    url: '/TaxOrg/getAllDictionary',
    method: 'get',
    params: query
  })
}
