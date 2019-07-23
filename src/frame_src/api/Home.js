import request from '@/frame_src/utils/request'
export function getMonthData(query) { // 首页柱状图查询
  return request({
    url: '/Home/getMonthData',
    method: 'get',
    params: query
  })
}

export function getNotice(query) { // 通知公告查询
  return request({
    url: '/Home/getNotice',
    method: 'get',
    params: query
  })
}

export function getNoticeDetail(query) { // 通知公告查询
  return request({
    url: '/Home/getNoticeDetail',
    method: 'get',
    params: query
  })
}

export function getLv(query) { // 获取纳税百分比
  return request({
    url: '/Home/getLv',
    method: 'get',
    params: query
  })
}

export function CompareData(query) { // 通知公告查询
  return request({
    url: '/Home/CompareData',
    method: 'get',
    params: query
  })
}