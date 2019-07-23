import request from '@/frame_src/utils/request'
export function getExportPayerInfo(query) { // 金税人员查询
  return request({
    url: '/Export/getExportPayerInfo',
    method: 'get',
    params: query
  })
}

export function getExportSalary(query) { // Demo信息配置查询
  return request({
    url: '/Export/getExportSalary',
    method: 'get',
    params: query
  })
}
export function exportSalary(query) { // Demo信息配置查询exportSalary
  return request({
    url: '/Export/exportSalary',
    method: 'get',
    params: query
  })
}
export function exportOnceBonus(query) { // 金税导出一次性奖金
  return request({
    url: '/Export/exportOnceBonus',
    method: 'get',
    params: query
  })
}
export function getExportOnceBonus(query) { // Demo信息配置查询
  return request({
    url: '/Export/getExportOnceBonus',
    method: 'get',
    params: query
  })
}

export function getOrgStatus(query) {
  return request({
    url: '/Export/getOrgStatus',
    method: 'get',
    params: query
  })
}

export function getTaxNumberOptions(query) {
  return request({
    url: '/Export/getTaxNumberOptions',
    method: 'get',
    params: query
  })
}

export function exportPayerInfo(data) { 
  return request({
    url: '/TaxPlayerInfo/exportPayerInfo',
    method: 'post',
    data
  })
}

export function exportChangePayerInfo(data) { 
  return request({
    url: '/TaxPlayerInfo/exportChangePayerInfo',
    method: 'post',
    data
  })
}

