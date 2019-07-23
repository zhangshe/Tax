import request from '@/frame_src/utils/request'
export function getTaxSalaryList(query) { // 工资数据查询
  return request({
    url: '/TaxSalary/getTaxSalaryList',
    method: 'get',
    params: query
  })
}

export function exportBaseTaxSalary(query) { // 工资导出查询
  return request({
    url: '/TaxSalary/exportBaseTaxSalary',
    method: 'get',
    params: query
  })
}

export function getMonthTaxSalaryDetail(query) { // 月度个税统计
  return request({
    url: '/TaxSalary/getMonthTaxSalaryDetail',
    method: 'get',
    params: query
  })
}

export function getMonthTaxSalary(query) { // 月度累计个税统计
  return request({
    url: '/TaxSalary/getMonthTaxSalary',
    method: 'get',
    params: query
  })
}

export function uploadTaxSalary(data) {
  return request({
    url: '/TaxSalary/uploadTaxSalary',
    method: 'post',
    data
  })
}

export function delTaxSalary(data) {
  return request({
    url: '/TaxSalary/delTaxSalary',
    method: 'post',
    data
  })
}
export function getReportStatus(data) {
  return request({
    url: '/TaxSalary/getReportStatus',
    method: 'post',
    data
  })
}
export function exportMonthTaxSalaryDetail(query) {
  return request({
    url: '/TaxSalary/exportMonthTaxSalaryDetail',
    method: 'get',
    params: query
  })
}
export function getGroupMonthTaxSalary(query) {
  return request({
    url: '/TaxSalary/getGroupMonthTaxSalary',
    method: 'get',
    params: query
  })
}
export function getGroupSumMonthTaxSalary(query) {
  return request({
    url: '/TaxSalary/getGroupSumMonthTaxSalary',
    method: 'get',
    params: query
  })
}
export function exportMonthTaxSalary(query) {
  return request({
    url: '/TaxSalary/exportMonthTaxSalary',
    method: 'get',
    params: query
  })
}
export function exportGroupMonthTaxSalary(query) {
  return request({
    url: '/TaxSalary/exportGroupMonthTaxSalary',
    method: 'get',
    params: query
  })
}
export function exportGroupSumMonthTaxSalary(query) {
  return request({
    url: '/TaxSalary/exportGroupSumMonthTaxSalary',
    method: 'get',
    params: query
  })
}
export function exportPreCalTax(query) {
  return request({
    url: '/TaxSalary/exportPreCalTax',
    method: 'get',
    params: query
  })
}
export function getPreCalculateTax(query) { // 月度个税统计
  return request({
    url: '/TaxSalary/getPreCalculateTax',
    method: 'get',
    params: query
  })
}
export function getSumPreCalculateTax(query) {
  return request({
    url: '/TaxSalary/getSumPreCalculateTax',
    method: 'get',
    params: query
  })
}

