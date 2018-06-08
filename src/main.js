// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import './assets/css/reset.css'
import './assets/css/custom.less'

import '../static/font/iconfont.css'

import {userInfo} from './hxp'

//跳转F7页面传值
Vue.prototype.changeUrl = function(url,data){
  return userInfo(url,data)
}

Vue.use(MintUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
