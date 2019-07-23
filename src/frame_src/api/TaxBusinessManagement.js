import request from '@/frame_src/utils/request'
export function UploadTaxBusiness(data) {
    return request({
      url: '/TaxBusinessManagement/UploadTaxBusiness',
      method: 'post',
      data
    })
  }
  
  export function delTaxBusiness(data) {
    return request({
      url: '/TaxBusinessManagement/delTaxBusiness',
      method: 'post',
      data
    })
  }

  export function getTaxInfo(query) {
    return request({
      url: '/TaxBusinessManagement/getTaxInfo',
      method: 'get',
      params:query
    })
  }

  export function getCount(query) {
    return request({
      url: '/TaxBusinessManagement/getCount',
      method: 'get',
      params:query
    })
  }