'use strict'
let assetsPublicPath = '' // 外网静态资源oss地址
switch (process.env.CONFIG) {
  case 'inner':
    assetsPublicPath = '"/"'
    break
  case 'release':
    assetsPublicPath = '"/aa"'
    break
  default:
    assetsPublicPath = '"/"'
    break
}

module.exports = {
  assetsPublicPath: assetsPublicPath
}
