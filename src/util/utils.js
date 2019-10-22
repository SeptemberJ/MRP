import CryptoJS from 'crypto-js'

// 格式化url串 返回格式'?phone=18234567890&psd=123456'
export function formatUrl (parameterObj) {
  let params = Object.values(parameterObj).reduce((a, b, i) => `${a}${Object.keys(parameterObj)[i]}=${b}&`, '?')
  return params.substring(0, params.length - 1)
}

// AES加密
export function Encrypt (plaintText) {
  var keyStr = 'htjk_liubai'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  // var iv = CryptoJS.enc.Utf8.parse('qwertyuiopasdfgh')
  var encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
    // iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  // var encryptedBase64Str = encryptedData.toString()
  var encryptedStr = encryptedData.ciphertext.toString()
  return encryptedStr
}

// AES解密
export function Decrypt (encryptedStr) {
  var keyStr = 'htjk_liubai'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedStr)
  var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8)
  return decryptedStr
}

// 创建cookie
export function setCookie (cname, cvalue, exhours) {
  var d = new Date()
  d.setTime(d.getTime() + (exhours * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + '; ' + expires
}

// 获取cookie
export function getCookie (cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1)
    if (c.indexOf(name) !== -1) return c.substring(name.length, c.length)
  }
  return ''
}

// 删除cookie
export function clearCookie (name) {
  setCookie(name, '', -1)
}

// 时间格式化字符串(传递内容, 需要的格式化类型[Complete, Simple, NotSecond], 年月日分割符号)
export function formatToString (parameter, formatType, splitType) {
  var oDate
  if (typeof parameter === 'object') {
    // 传递的是Date
    oDate = parameter
  } else {
    // 传递的是秒数则转换为Date类型
    oDate = new Date(parameter)
  }
  var oYear = oDate.getFullYear()
  var oMonth = oDate.getMonth() + 1
  var oDay = oDate.getDate()
  var oHour = oDate.getHours()
  var oMin = oDate.getMinutes()
  var oSen = oDate.getSeconds()
  switch (formatType) {
    case 'Complete':
      return (oYear + splitType + getzf(oMonth) + splitType + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen))
    case 'Simple':
      return (oYear + splitType + getzf(oMonth) + splitType + getzf(oDay))
    case 'NotSecond':
      return (oYear + splitType + getzf(oMonth) + splitType + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin))
  }
}
// 补零
function getzf (num) {
  if (parseInt(num) < 10) {
    num = '0' + num
  }
  return num
}

// uuid
export function getuuid () {
  var uid = []
  var hexDigits = 'getuuid_liubai'
  for (var i = 0; i < 32; i++) {
    uid[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  uid[6] = '4'
  uid[15] = hexDigits.substr((uid[15] & 0x3) | 0x8, 1)
  var uuid = uid.join('')
  return uuid
}

// 数组对象深度拷贝
export function objDeepCopy (sourceArr) {
  var sourceCopy = sourceArr instanceof Array ? [] : {}
  for (var item in sourceArr) {
    sourceCopy[item] = typeof sourceArr[item] === 'object' ? objDeepCopy(sourceArr[item]) : sourceArr[item]
  }
  return sourceCopy
}

// 将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
export function parseDate (str) {
  var a = str.split(/[^0-9]/)
  return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])
}

// 继承
export function inherits (child, parent) {
  var Fn = function () {}
  Fn.prototype = parent.prototype
  child.prototype = new Fn()
  child.prototype.constructor = child
  // 或者直接 child.prototype = Object.create(parent.prototype)
}

// 获取url中的指定参数 getQueryString()['name']
// export function getQueryString () {
//   var QueryString = {
//     data: {},
//     Initial: function () {
//       var aPairs, aTmp
//       var queryString = new String(window.parent.location.search)
//       queryString = queryString.substr(1, queryString.length) // 去掉"?"
//       aPairs = queryString.split('&')
//       for (var i = 0; i < aPairs.length; i++) {
//         aTmp = aPairs[i].split('=')
//         this.data[aTmp[0]] = aTmp[1]
//       }
//     },
//     GetValue: function (key) {
//       return this.data[key]
//     }
//   }
//   QueryString.Initial()
//   return QueryString.data
// }

// 升降序排序
export function DOAsort (itemList, sortProperty, sortWay) {
  var objectList = []
  function RecombineObj (item) {
    var _this = this
    for (var key of Object.keys(item)) {
      _this[key] = item[key]
    }
  }
  itemList.map(function (item, index) {
    objectList.push(new RecombineObj(item))
  })
  switch (sortWay) {
    case 'Des':
      objectList.sort(function (a, b) {
        return b[sortProperty] - a[sortProperty]
      })
      break
    case 'Asc':
      objectList.sort(function (a, b) {
        return a[sortProperty] - b[sortProperty]
      })
      break
    default:
      return objectList
  }
  return objectList
}

// 随机验证码
export function createCode () {
  let code = ''
  let codeLength = 5
  let random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  for (var i = 0; i < codeLength; i++) {
    var index = Math.floor(Math.random() * 62)
    code += random[index]
  }
  return code
}

// 密码验证(包含数字和字母 限定最小长度)
export function checkPsd (PSD, LimitLen) {
  let regu = '^[0-9a-zA-Z]{6,12}$'
  let re = new RegExp(regu)
  if (PSD.length < LimitLen) {
    return false
  }
  if (re.test(PSD)) {
    return true
  } else {
    return false
  }
}

// 当前日期是这个月的第几周
export function getMonthWeek (a, b, c) {
  const date = new Date(a, parseInt(b) - 1, c)
  const w = date.getDay() // 6 - w 当前周的还有几天过完（不算今天）
  const d = date.getDate()
  return Math.ceil(
    (d + 6 - w) / 7
  )
}
// getMonthWeek(2019, 5, 21)

// 获取当前月的天数
export function getCountDays () {
  const curDate = new Date()
  const mon = curDate.getMonth()
  curDate.setMonth(mon + 1)
  curDate.setDate(0)
  return curDate.getDate()
}

// 当前月有几周
export function getCurMonthWeeks () {
  let curDate = new Date()
  curDate.setDate(1) // 本月第一天
  let weekDay = curDate.getDay() // 第一天是周几
  let firstWeekLeft = 7 - weekDay // 第一周还有几天
  let monthDayLeft = 31 - firstWeekLeft - 1 // 除了第一周后还有几天
  // let monthWeeks = Math.ceil(monthDayLeft / 7) + 1
  return Math.ceil(monthDayLeft / 7) + 1
}

// 增删改查本地存储
let local = {
  set (key, value) {
    if (checkLocalStorage()) {
      window.localStorage.setItem(key, value)
    } else {
      let Days = 30
      let exp = new Date()
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
      document.cookie = key + '=' + escape(value) + ';expires=' + exp.toGMTString()
    }
  },
  get (key) {
    if (checkLocalStorage()) {
      return window.localStorage.getItem(key) ? window.localStorage.getItem(key) : null
    } else {
      return getCookieR(key)
    }
  },
  clear (key) {
    if (checkLocalStorage()) {
      window.localStorage.removeItem(key)
    } else {
      let exp = new Date()
      exp.setTime(exp.getTime() - 1)
      let cval = getCookieR(key)
      if (cval != null) document.cookie = key + '=' + cval + ';expires=' + exp.toGMTString()
    }
  }
}

function checkLocalStorage () {
  // 确认是否支持Localstorage
  return window.localStorage && (window.localStorage.setItem('a', 123), window.localStorage.getItem('a') === 123)
}
function getCookieR (name) {
  let arr
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) return unescape(arr[2])
  else return null
}

export default {
  local
}
