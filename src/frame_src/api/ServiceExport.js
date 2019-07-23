import request from '@/frame_src/utils/request'
export function getOrgStatus(query) {
    return request({
      url: '/ServiceRemunerationExport/getOrgStatus',
      method: 'get',
      params: query
    })
  }
  export function ExportServiceTaxDetail(query) {
    return request({
      url: '/ServiceRemunerationExport/ExportServiceTaxDetail',
      method: 'get',
      params: query
    })
  }