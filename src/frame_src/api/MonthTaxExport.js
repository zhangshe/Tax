import request from '@/frame_src/utils/request'

export function getMonthTax(query) {
  return request({
    url: '/MonthTaxExport/getMonthTax',
    method: 'get',
    params: query
  })
}
export function getYearTax(query) {
  return request({
    url: '/MonthTaxExport/getYearTax',
    method: 'get',
    params: query
  })
}
export function exportMonthTax(query) {
  return request({
    url: '/MonthTaxExport/exportMonthTax',
    method: 'get',
    params: query
  })
}
export function exportYearTax(query) {
  return request({
    url: '/MonthTaxExport/exportYearTax',
    method: 'get',
    params: query
  })
}
