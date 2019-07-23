import request from '@/frame_src/utils/request'
export function getlist(query) { // 获取劳务明细
  return request({
    url: '/ServiceRemunerationImport/getlist',
    method: 'get',
    params:query
  })
}

export function importdata(data) { // 导入
    return request({
      url: '/ServiceRemunerationImport/importdata',
      method: 'post',
      data
    })
  }


  export function getcount(query) { //获取导入状态
    return request({
      url: '/ServiceRemunerationImport/getcount',
      method: 'get',
      params:query
    })
  }


  export function delData(query) { //获取导入状态
    return request({
      url: '/ServiceRemunerationImport/delData',
      method: 'get',
      params:query
    })
  }

    export function getReportState(query) { //获取上报状态
    return request({
      url: '/ServiceRemunerationImport/getReportState',
      method: 'get',
      params:query
    })
  }