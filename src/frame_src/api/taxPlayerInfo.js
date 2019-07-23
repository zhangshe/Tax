import request from '@/frame_src/utils/request'
export function fetchTaxPlayerInfo(query) { // 查询用户
  return request({
    url: '/TaxPlayerInfo/fetchTaxPlayerInfo',
    method: 'get',
    params: query
  })
}

export function createTaxPlayerInfo(data) {
  return request({
    url: '/TaxPlayerInfo/createTaxPlayerInfo',
    method: 'post',
    data
  })
}

export function delTaxPlayerInfo(data) {
  return request({
    url: '/TaxPlayerInfo/delTaxPlayerInfo',
    method: 'post',
    data
  })
}

export function editTaxPlayerInfo(data) {
  return request({
    url: '/TaxPlayerInfo/editTaxPlayerInfo',
    method: 'post',
    data
  })
}

export function getAllOptions(query) { // 查询全部下拉菜单选项
  return request({
    url: '/TaxPlayerInfo/getAllOptions',
    method: 'get',
    params: query
  })
}

export function fetchTaxPlayerChange(query) { // 查询人员变动接口
  return request({
    url: '/TaxPlayerInfo/fetchTaxPlayerChange',
    method: 'get',
    params: query
  })
}

export function getTaxContent(query) { // 查询人员变动接口
  return request({
    url: '/TaxPlayerInfo/getTaxContent',
    method: 'get',
    params: query
  })
}

export function fetchTaxOrgNodeList(query) { // 根据ID查询组织机构
  return request({
    url: '/TaxOrg/fetchTaxOrgNodeList',
    method: 'get',
    params: query
  })
}

export function getTaxpayer(query) { // 查询纳税人信息
  return request({
    url: '/TaxPlayerInfo/getTaxpayer',
    method: 'get',
    params: query
  })
}

export function getPayerSalary(query) { // 查询纳税人信息
  return request({
    url: '/TaxPlayerInfo/getPayerSalary',
    method: 'get',
    params: query
  })
}

export function uploadTaxPayerInfo(data) { // 导入纳税人信息
  return request({
    url: '/TaxPlayerInfo/uploadTaxPayerInfo',
    method: 'post',
    data
  })
}
