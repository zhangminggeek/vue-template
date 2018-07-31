import axios from 'axios'
import { Message, Loading } from 'element-ui'
import router from '@/router'

// create loading
let loading

function startLoading () {
  loading = Loading.service({
    target: document.getElementById('app'),
    lock: true,
    text: '加载中……',
    background: 'rgba(255, 255, 255, 0.7)'
  })
}

function endLoading () {
  loading.close()
}

let needLoadingRequestCount = 0 // 需要loading层的请求数量

function showFullScreenLoading (isLoading = true) {
  if (needLoadingRequestCount === 0 && isLoading) {
    startLoading()
  }
  if (isLoading) {
    needLoadingRequestCount++
  }
}

function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) {
    return false
  }
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

// create an error messsage
let errMsg = msg => {
  Message({
    message: msg,
    type: 'error',
    duration: 5 * 1000
  })
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  // timeout: 5000, // request timeout
  method: 'post'
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  showFullScreenLoading(config.loading)
  return config
}, error => {
  // Do something with request error
  if (error.status === '504') {
    errMsg('网关超时，请重试！')
  } else {
    errMsg(`网络异常[-${error.status}]`)
    console.log(error) // for debug
  }
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    tryHideFullScreenLoading()
    const res = response.data
    if (res.result) {
      return res
    } else {
      if (res.code === 'ERR-110') {
        router.replace({ path: '/home/login' })
      }
      const msg = res.msg || '请求失败，请刷新重试'
      errMsg(msg)
      return Promise.reject('error')
    }
  },
  error => {
    // 此处错误已由node项目中finalResult方法包装处理
    tryHideFullScreenLoading()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  })

export default service
