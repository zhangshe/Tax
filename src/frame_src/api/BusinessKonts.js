import request from '@/frame_src/utils/request'
export function fetchTaxPlayerInfo(query) { // 查询用户
  return request({
    url: '/TaxPlayerInfo/fetchTaxPlayerInfo',
    method: 'get',
    params: query
  })
}

export function MonthKonts(data){
    return request({
        url:'/BusinessKonts/MonthKonts',
        method:'post',
        data
    })
}

export function getCalculateData(query){
    return request({
        url:'/BusinessKonts/getCalculateData',
        method:'get',
        params:query
    })
}

export function judgeStatus(query){
    return request({
        url:'/BusinessKonts/judgeStatus',
        method:'get',
        params:query
    })
}

export function getJudgeCount(query){
    return request({
        url:'/BusinessKonts/getJudgeCount',
        method:'get',
        params:query
    })
}
