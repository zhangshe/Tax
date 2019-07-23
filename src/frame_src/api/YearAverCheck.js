import request from '@/frame_src/utils/request'

export function getYearAverCheck(query) {
  return request({
    url: '/YearAverCheck/getYearAverCheck',
    method: 'get',
    params: query
  })
}
export function exportYearAverTax(query) {
  return request({
    url: '/YearAverCheck/exportYearAverTax',
    method: 'get',
    params: query
  })
}
