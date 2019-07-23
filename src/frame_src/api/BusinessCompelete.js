import request from '@/frame_src/utils/request'
export function getStatus(query) { // 查询用户
  return request({
    url: '/BusinessComplete/getStatus',
    method: 'get',
    params: query
  })
}

export function Report(data) {
  return request({
    url: '/BusinessComplete/Report',
    method: 'post',
    data
  })
}

export function getCalculateData(query) {
  return request({
    url: '/BusinessComplete/getCalculateData',
    method: 'get',
    params: query
  })
}

export function getDepartmentStatus(query) {
  return request({
    url: '/BusinessComplete/getDepartmentStatus',
    method: 'get',
    params: query
  })
}

export function unlock(data) {
  return request({
    url: '/BusinessComplete/unlock',
    method: 'post',
    data
  })
}

export function locking(data) {
  return request({
    url: '/BusinessComplete/locking',
    method: 'post',
    data
  })
}
