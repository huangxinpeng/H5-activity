
import { source, post, postQuery ,get ,getQuery , put } from './base'

export {source}

//登陆
export function isLogin(params) {
  return post('/sys-user/login', params, 'application/x-www-form-urlencoded')
}

// 获取搜索栏默认主题
export function getSearch(params){
  return post('/search/getSearchTheme.ext',{'type':params})
}
// 获取广告页列表
export function getBanner(){
  return post('/banner/getBannerList.ext')
}
// 获取活动类型
export function getActivityType(params){
  return post('/type/getActivityType.ext',{'home':params})
}

// 获取首页板块
export function getPart(params){
  return post('/home/getHPPartList.ext',{'mobile':params})
}

// 获取活动列表
export function getActivityList(params){
	// {
 //    activityType:0,1,2,
 //    hot,
 //    theme,
 //    page,
 //    pageSize,
 //  }
  return post('/citySec/getActivityList.ext',params)
}


// 热门榜单
export function getHotList(params){
  return post('/home/getHPHotPartList.ext',{'partId':params})
}



// 猜你喜欢
export function getLikeList(params , mobile=''){
  return post('/home/getHPLikePartList.ext',{'partId':params,'mobile':mobile})
}

// 搜索 列表
export function getSearchList(params){
  return post('/search/getActThemeList.ext',{
  	page:params.p,
  	pageSize:params.s,
  	theme:params.c,
  })
}