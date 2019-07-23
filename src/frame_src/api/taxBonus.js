import request from '@/frame_src/utils/request'
export function getOneBonusList(query) {
  return request({
    url: '/TaxBonus/getBonusList',
    method: 'get',
    params: query
  })
}

export function exportBaseOneBonus(query) {
  return request({
    url: '/TaxBonus/exportBaseOneBonus',
    method: 'get',
    params: query
  })
}

export function uploadTaxBonus(data) {
  return request({
    url: '/TaxBonus/uploadTaxBonus',
    method: 'post',
    data
  })
}

export function delTaxBonus(data) {
  return request({
    url: '/TaxBonus/delTaxBonus',
    method: 'post',
    data
  })
}

