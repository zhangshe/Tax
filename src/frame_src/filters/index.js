// set function parseTime,formatTime to filter
export { parseTime, formatTime } from '@/frame_src/utils'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function NumFormat(value) {//格式化金额，+逗号分隔，保留两位小数
  if(!value || value=="" || value==null || value==undefined) return '0.00';
      if(value.toString().indexOf("合计")>=0)//判断是否是合计
      return value;
			/*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
			var intPart =  Number(value)|0; //获取整数部分
			var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

			var floatPart = ".00"; //预定义小数部分
			var value2Array = value.toString().split('.');
      
			//=2表示数据有小数位
			if(value2Array.length == 2) {
				floatPart = value2Array[1].toString(); //拿到小数部分
				if(floatPart.length == 1) { //补0,实际上用不着
					return intPartFormat + "." + floatPart + '0';
        } 
        else {
					return intPartFormat + "." + (floatPart.substr(0,2));
				}

			} else {
        return intPartFormat + floatPart;
        
			}
}