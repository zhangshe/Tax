import request from '@/frame_src/utils/request'
export function getOneTimeBonusListImport(query) {
  return request({
    url: '/OneTimeBonus/getOneTimeBonusListImport',
    method: 'get',
    params: query
  })
}
export function getOneTimeBonusList(query) {
  return request({
    url: '/OneTimeBonus/getOneTimeBonusList',
    method: 'get',
    params: query
  })
}

export function exportOneTimeBonus(query) {
  return request({
    url: '/OneTimeBonus/exportOneTimeBonus',
    method: 'get',
    params: query
  })
}

export function uploadOneTimeBonus(data) {
  return request({
    url: '/OneTimeBonus/uploadOneTimeBonus',
    method: 'post',
    data
  })
}

export function clearTaxBonus(data) {
  return request({
    url: '/OneTimeBonus/clearTaxBonus',
    method: 'post',
    data
  })
}

export function delOneTimeBonus(data) {
  return request({
    url: '/OneTimeBonus/delOneTimeBonus',
    method: 'post',
    params: data
  })
}
