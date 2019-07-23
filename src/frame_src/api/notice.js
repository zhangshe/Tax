import request from '@/frame_src/utils/request'
export function fetchNoticeList(query) { // 公告查询
  return request({
    url: '/notice/fetchNoticeList',
    method: 'get',
    params: query
  })
}
export function createNoticeArticle(data) { // 创建公告主表信息
  return request({
    url: '/notice/createNoticeArticle',
    method: 'post',
    data
  })
}
export function updateNoticeData(data) { // 修改公告主表信息
  return request({
    url: '/notice/updateNoticeData',
    method: 'post',
    data
  })
}
export function updateNoticeArticle(data) { // -删除
  return request({
    url: '/notice/updateNoticeArticle',
    method: 'post',
    data
  })
}

export function fetchNoticeDetailList(query) { 
  return request({
    url: '/noticedetail/fetchNoticeDetailList',
    method: 'get',
    params: query
  })
}


export function createNoticeDetailArticle(data) { 
  return request({
    url: '/noticedetail/createNoticeDetailArticle',
    method: 'post',
    data
  })
}

export function updateNoticeDetailArticle(data) {
  return request({
    url: '/noticedetail/updateNoticeDetailArticle',
    method: 'post',
    data
  })
}
