import request from '@/frame_src/utils/request'
export function TaxCalculate(data) { // 计算个税
  return request({
    url: '/TaxCalculate/Calculate',
    method: 'post',
    data
  })
}
export function GetData(query) { // 查询当前工资信息，是否导入是否计算过
  return request({
    url: '/TaxCalculate/getCalculateData',
    method: 'get',
    params: query
  })
}
export function InverseCalculate(query) { // 工资到算器
  return request({
    url: '/TaxCalculate/InverseCalculate',
    method: 'get',
    params: query
  })
}
export function cal(query) { // 个税计算器
  return request({
    url: '/TaxCalculate/cal',
    method: 'get',
    params: query
  })
}
export function onetimecal(query) { // 一次性奖金计算器
  return request({
    url: '/TaxCalculate/onetimecal',
    method: 'get',
    params: query
  })
}
export function Yearcal(query) { // 个税计算器(按年)
    return request({
      url: '/TaxCalculate/Yearcal',
      method: 'get',
      params: query
    })
}
export function calPreCalculateTax(query) { // 个税测算
  return request({
    url: '/TaxCalculate/calPreCalculateTax',
    method: 'get',
    params: query
  })
}
