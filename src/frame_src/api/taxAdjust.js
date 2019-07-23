import request from '@/frame_src/utils/request'
export function getTaxAdjustList(query) {
  return request({
    url: '/TaxAdjust/getTaxAdjustList',
    method: 'get',
    params: query
  })
}

export function exportBaseTaxAdjust(query) {
  return request({
    url: '/TaxAdjust/exportBaseTaxAdjust',
    method: 'get',
    params: query
  })
}

export function uploadTaxAdjust(data) {
  return request({
    url: '/TaxAdjust/uploadTaxAdjust',
    method: 'post',
    data
  })
}

export function delTaxAdjust(data) {
  return request({
    url: '/TaxAdjust/delTaxAdjust',
    method: 'post',
    data
  })
}
