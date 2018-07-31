import * as commonApi from '@/api/common'
import md5 from 'js-md5'

export function checkForm (target, form) {
  return new Promise((resolve, reject) => {
    target.$refs[form].validate((valid) => {
      if (valid) {
        resolve()
      } else {
        return false
      }
    })
  })
}

export function transformValueToLabel (val, arr, label = 'label', value = 'value') {
  const res = arr.filter(item => {
    return item[value] === val
  })
  if (res.length) {
    return res[0][label]
  }
}

export function formatDate (date, type = 1) {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date)
  }
  const y = date.getFullYear()
  const M = toDouble(date.getMonth() + 1)
  const d = toDouble(date.getDate())
  const h = toDouble(date.getHours())
  const m = toDouble(date.getMinutes())
  const s = toDouble(date.getSeconds())
  if (type === 1) {
    return `${y}-${M}-${d} ${h}:${m}:${s}`
  } else if (type === 2) {
    return `${y}-${M}-${d}`
  } else if (type === 3) {
    return `${h}:${m}`
  }
}

export function toDouble (num) {
  return num < 10 ? '0' + num : num
}

export function addDate (target, unit, value) {
  switch (unit) {
    case 'y':
      target.setFullYear(target.getFullYear() + value)
      break
    case 'M':
      target.setMonth(target.getMonth() + value)
      break
    case 'd':
      target.setDate(target.getDate() + value)
      break
    case 'h':
      target.setHours(target.getHours() + value)
      break
    case 'm':
      target.setMinutes(target.getMinutes() + value)
      break
    case 's':
      target.setSeconds(target.getSeconds() + value)
      break
  }
  return target
}

// 获取文件后缀
export function getSuffix (filename) {
  const pos = filename.lastIndexOf('.')
  let suffix = ''
  if (pos !== -1) {
    suffix = filename.substring(pos)
  }
  return suffix
}

// 生成随机数（默认32位）
export function randomString (len) {
  len = len || 32
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

// 设置cookie
export function setCookie (cname, cvalue, exdays, path = '/') {
  let d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  const expires = 'expires=' + d.toUTCString()
  const cpath = 'path=' + path
  document.cookie = cname + '=' + cvalue + '; ' + expires + ';' + cpath
}

// 获取cookie
export function getCookie (cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1)
    if (c.indexOf(name) !== -1) return c.substring(name.length, c.length)
  }
  return ''
}

// 清除cookie
export function clearCookie (name) {
  setCookie(name, '', -1)
}

// 获取signature
export function getSignature (name) {
  return new Promise((resolve, reject) => {
    const res = getCookie('sign') ? JSON.parse(getCookie('sign')) : ''
    const timestamp = Date.parse(new Date()) / 1000
    if (res.expire - 3 * 60 > timestamp) {
      resolve(res)
    } else {
      commonApi[name]().then(res => {
        setCookie('sign', JSON.stringify(res.data))
        resolve(res.data)
      })
    }
  })
}

// url拼接参数转换为对象格式
export function transformUrlToObject (data) {
  const arr = data.split('&')
  let obj = {}
  arr.forEach(item => {
    const pair = item.split('=')
    obj[pair[0]] = pair[1]
  })
  return obj
}

// 生成盐值
export function createSalt () {
  let result = Math.floor(Math.random() * 90 + 10).toString()
  for (let i = 0; i < 2; i++) {
    const ranNum = Math.ceil(Math.random() * 25)
    result += String.fromCharCode(65 + ranNum).toString()
  }
  return result
}

// 密码加密解密
export function encryptPwd (param) {
  let password = ''
  for (let i in param) {
    password += i % 2 ? (param.charCodeAt(i) << 2).toString() + '*' : (param.charCodeAt(i) << 3).toString() + '*'
  }
  password = password.slice(0, password.length - 1)
  return password
}
export function decodwPwd (param) {
  let password = ''
  if (param && param.indexOf('*') !== -1) {
    const passwordObj = param.split('*')
    for (let i in passwordObj) {
      password += i % 2 ? String.fromCharCode(passwordObj[i] >> 2) : String.fromCharCode(passwordObj[i] >> 3)
    }
  } else {
    password = param
  }
  return password
}

// 生成加盐加密后密码
export function createNewPassword (password, salt) {
  return md5(encryptPwd(salt + password))
}
