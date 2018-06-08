

import { post, get, getQuery, put } from './base'
//不同状态订单个数
export function OrderCount(params){
	return post('/citySec/getUserOrderCount.ext', params)
}
//用户报名的活动(订单)
export function ActivityList(params) {
	return post('/citySec/getUserActivityList.ext', params)
}
//订单详情
export function getOrderDetail(params){
	return post('/citySec/getOrderDetail.ext', params)
}
//获取活动专题列表
export function getActivityTopicList(params){
	return post('/topic/getActivityTopicList.ext',params)
}
//获取token   
export function getUserIdByToken(params){
	return post('/baseUser/getUserIdByToken.ext',params)
}
//添加用户浏览记录
export function addScanRecord(params,id){
	var mobile, userId, userName
	if (localStorage.getItem('mobile')) {
		mobile = localStorage.getItem('mobile')
		userId = localStorage.getItem('userId')
		userName = localStorage.getItem('userName')
	}
	let recordlist = {};
	recordlist.activityId = id
	recordlist.mobile = mobile
	recordlist.scanType = params
	recordlist.userId = userId
	return post('/home/addScanRecord.ext', recordlist)
}
export function getBusinessUserList(params){
	//userId为手机号
	return post('/cityActSecTwo/getBusinessUserList.ext', { 'userId': params})
}
