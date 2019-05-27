import Vue from 'vue'
import App from './App'
import router from './router'

// 自定义了一个全局css样式 引入在main.js中
import './assets/css/global.css'

// 引入字体图表的css
import './assets/fonts/iconfont.css'

// 此处elementui 的css是按需引入的
import 'element-ui/lib/theme-chalk/index.css'

import ElementUI from 'element-ui'

// 引入面包屑模块
import Cru from './components/share/Crumb.vue'

// 引入moment
import moment from 'moment'

// 引入 配置 axios
import axios from 'axios'

// 引入nprogress
import NProgress from 'nprogress'
// 引入nprogress 样式文件
import '../node_modules/nprogress/nprogress.css'

axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
Vue.prototype.$http = axios

Vue.use(ElementUI)

// moment时间过滤器使用(goods页面使用到了过滤器)
Vue.filter('dateFormat', a => {
  return moment(a).format('YYYY-MM-DD')
})

// 是否在控制台提示当前环境是开发者环境
Vue.config.productionTip = false

// 配置axios拦截器 目的是为了实时监控token是否存在
// 并且服务器要求 请求数据的时候必须携带token
axios.interceptors.request.use(
  function(config) {
    // 响应开始时加载nprogress动画
    NProgress.start()
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)
// axios 响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 响应完成后加载nprogress动画
    NProgress.done()
    return response
  },
  function(error) {
    return Promise.reject(error)
  }
)

// 将面包屑导航注册为全局组件
Vue.component('com-cru', Cru)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
