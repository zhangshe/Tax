import request from '@/frame_src/utils/request'
export function getSubtrackStandardConfig(query) { // 查询配置
  return request({
    url: '/ParamsConfig/getSubtrackStandardConfig',
    method: 'get',
    params: query
  })
}

export function editConfig(data) {
  return request({
    url: '/ParamsConfig/editConfig',
    method: 'post',
    data
  })
}

export function createConfig(data) {
  return request({
    url: '/ParamsConfig/createConfig',
    method: 'post',
    data
  })
}

export function delConfig(data) {
  return request({
    url: '/ParamsConfig/delConfig',
    method: 'post',
    data
  })
}

// 以上是减除项接口，以下是扣减项接口

export function getAllDictionary(query) { // 查询全部字典下拉
  return request({
    url: '/ParamsConfig/getAllDictionary',
    method: 'get',
    params: query
  })
}
export function getDecreasingConfig(query) { // 查询配置
  return request({
    url: '/ParamsConfig/getDecreasingConfig',
    method: 'get',
    params: query
  })
}

export function createDecreasingConfig(data) {
  return request({
    url: '/ParamsConfig/createDecreasingConfig',
    method: 'post',
    data
  })
}

export function delDecreasingConfig(data) {
  return request({
    url: '/ParamsConfig/delDecreasingConfig',
    method: 'post',
    params: data
  })
}

export function editDecreasingConfig(data) {
  return request({
    url: '/ParamsConfig/editDecreasingConfig',
    method: 'post',
    data
  })
}

export function fetchTaxOrgNodeList(query) { // 查询组织机构
  return request({
    url: '/TaxOrg/fetchTaxOrgNodeList',
    method: 'get',
    params: query
  })
}

export function getTaxComputeconfig(query) { // 查询组织机构
  return request({
    url: '/ParamsConfig/getTaxComputeconfig',
    method: 'get',
    params: query
  })
}

export function updateTaxComputeconfig(data) {
  return request({
    url: '/ParamsConfig/updateTaxComputeconfig',
    method: 'post',
    data
  })
}
export function updateTaxDateSub(query) { // 设置起征点5000
  return request({
    url: '/ParamsConfig/updateTaxDateSub',
    method: 'get',
    params: query
  })
}
export function getTaxDateSub(query) { // 查询起征点
  return request({
    url: '/ParamsConfig/getTaxDateSub',
    method: 'get',
    params: query
  })
}
