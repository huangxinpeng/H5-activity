import Vue from 'vue'
import Router from 'vue-router'
import Tab from '@/pages/Tab'
import Home from '@/pages/Home'
import User from '@/pages/User'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:{name:'Home'},
      name: 'Tab',
      component: Tab,
      children:[
      	{
      		path:'Home',
          name:'Home',
          component: Home,
      	},{
          path:'User',
          name:'User',
          component: User,
        },
      ]
    },{
      path:'/Search',
      name:'Search',
      component (resolve) {
        require(['@/pages/search/searchInput'], resolve)
      } 
    },{
      path:'/CategoryAll',
      name:'CategoryAll',
      component (resolve) {
        require(['@/pages/category/categoryAll'], resolve)
      } 
    },{
      path:'/CategoryList',
      name:'CategoryList',
      component (resolve) {
        require(['@/pages/category/categoryList'], resolve)
      } 
    },{
      path:'/Special',
      name:'Special',
      component (resolve) {
        require(['@/pages/special/special'], resolve)
      }
    },{
      path:'/MoreList',
      name:'MoreList',
      component (resolve) {
        require(['@/pages/more/moreList'], resolve)
      } 
    },{
      path:'/HotList',
      name:'HotList',
      component (resolve) {
        require(['@/pages/hotList/hotList'], resolve)
      } 
    },{
      path:'/Order',
      name:'Order',
      component(resolve){
        require(['@/pages/order/orderDetail'], resolve)
      }
    }

  ]
})
