<template>
<div class='inner-block'>
  <div class="user-page" 
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-immediate-check='false'
    infinite-scroll-distance="15"
  >
    <div class="header">
      <p class="rt-intro"><span @click="becomeMerchants">成为商户?</span></p>
      <ul class="user-info">
        <li class=lt-img><img :src="headImg" alt="头像"></li>
        <li class="rt-text">
          <p class="rt-phone">{{phone_code}}</p>
          <span v-if="smkbtnOut" class="out-btn" @click='signOut'>退出</span>
        </li>
      </ul>
    </div>
    <div class="tabs">
      <ul class="clearfix" >
        <div  v-for="(list ,index) in tabsNew" :key="index">
        <li class="tab-item" :class="{'active':Active===index}"   @click="tabChange(list.id,index)">
          <i class="icon" :class="list.iconClass"></i>
          <p class="tab-title">{{list.tabtxt}}</p>
          <sup v-if="list.tabNew" class="badge">{{list.tabNew}}</sup>
        </li>
        </div>
      </ul>
    </div>
    <div class="act-list">
      <div class="blank" v-if='list.length==0'>
        <img class="blank-pic" src="../assets/images/user-blank.png" alt="暂无信息">
        <p class="noresult">暂无活动</p>
      </div>
      <ul class="inner" v-if='list.length>0'>
        <li class="act-item" v-for='(i,x) in list' :key='x' orderNo="" @click="orDetails(i.activityId,i.orderNo)" >
          <div class="act-img">
            <img :src="i.url">
            <p v-if='i.act_status=="1"' class="sign-in doing">报名进行中</p>
            <p v-if='i.act_status=="2"' class="sign-in end">报名已结束</p>
          </div>
          <div>
            <div class="gt-info">
              <p class="gt-title">{{i.title}} <span class="price" :class="[i.act_status==2?'shallow':'']">&#165;{{i.price}}</span></p>
              <p class="detail">{{i.detail}}</p>
              <p class="time-range"><span>{{i.time_start}}--{{i.time_end}}</span></p>
            </div>
            <p v-if='i.order_status=="01"' class="order-status">报名成功</p>
            <p v-if='i.order_status=="02"' class="order-status">报名失败</p>
            <p v-if='i.order_status=="03"' class="order-status">未报名</p>
            <p v-if='i.order_status=="04"' class="order-status" style="color: #ff4c29">待支付</p>
            <p v-if='i.order_status=="05"' class="order-status" style="color: #ff4c29">支付处理中</p>
            <p v-if='i.order_status=="06"' class="order-status">退款成功</p>
            <p v-if='i.order_status=="07"' class="order-status" style="color: #ff4c29">退款失败</p>
            <p v-if='i.order_status=="08"' class="order-status">已取消</p>
            <p v-if='i.order_status=="09"' class="order-status" style="color: #ff4c29">退款处理中</p>
          </div>
        </li>
         <p class="page-loading" :hidden='!loading'>{{txt}}</p>
      </ul>
    </div>
  </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { special,OrderCount,ActivityList,getOrderDetail,getBusinessUserList } from '../http/ajax'
  import { Loadmore,MessageBox,InfiniteScroll,Indicator,Toast} from 'mint-ui';
  import URL from '@/http/com.js'
   
export default {
  components:{
    [Toast.name]:Toast,
  },
  data () {
    return {
      user_head_default: './static/img/pic.png',
      user_head: '',
      user_phone:'',
      user_name:'',
      smkbtnOut:true,
      loading:false,
      Active:0,
      txt:'加载中...',
      defaultindex:1,//页码默认为1
      totalPages:'',
      actType:{
        activityType:'',
        entryStatus:'',
        page:1,
        pageSize:10,
        userId:localStorage.getItem('userMobile')
      },
      tabsNew:[
        {iconClass:'icon-qb',id:'',tabtxt:'全部', tabNew:'',},
        {iconClass:'icon-dzf',id:'04',tabtxt:'待支付',tabNew:''},
        {iconClass:'icon-clz',id:'05',tabtxt:'支付处理中',tabNew:''},
        {iconClass:'icon-bm',id:'01',tabtxt:'报名成功',tabNew:''},
        {iconClass:'icon-tk', id:'refund',tabtxt:'退款',tabNew:''},
        {iconClass:'icon-qx',id:'08',tabtxt:'已取消',tabNew:''},
      ],
      list:[],
      tablist:[],
    }
  },
  computed:{
    phone_code(){
      let code = this.user_phone.split('')
      code.splice(3,4,'****')
      return code.join('')
    },
    headImg(){
      if(this.user_head){
        return this.user_head
      }else{
        return this.user_head_default
      }
    },
  },
  methods:{
     loadMore() {
          this.loading = true;
          let typeDate={};
          typeDate.activityType=this.actType.activityType
          typeDate.entryStatus=this.actType.entryStatus
          typeDate.page=this.defaultindex+1
          typeDate.pageSize=this.actType.pageSize
          typeDate.userId=this.actType.userId
          if(this.totalPages>this.defaultindex){
            this.txt = '加载中...'
              ActivityList(typeDate).then((res)=>{
                 this.defaultindex = this.defaultindex + 1 
                 this.loading = false;
                let _res = res.response.activityList;
                this.tablist=this.list
                 for(var i = 0;i<_res.length;i++){
                     this.tablist.push({
                        id:_res[i].id,
                        url:_res[i].rfdsUrl+_res[i].activityPicList,
                        act_status:_res[i].actEntryStatus,
                        order_status:_res[i].orderStatus,
                        title:_res[i].theme,
                        price:_res[i].entryFee,
                        detail:_res[i].activityAddress,
                        time_start:_res[i].activityStartTime,
                        time_end:_res[i].activityEndTime,
                        orderNo:_res[i].orderNo,
                        activityId:_res[i].id,
                        })
                      }
                      this.list = this.tablist
                    }).catch(e=>{
                      // Toast('网络异常,请稍后再试')
                    })
          }else{
            this.txt = '没有更多活动了'
          }
    },
    tabChange(n,i){
     this.defaultindex=1;
     this.Active = i;
     this.tablist = [];
     this.loading=false;
     this.actType.entryStatus = n
      ActivityList(this.actType).then((res)=>{
        this.list='';
        this.totalPages = res.response.totalPages;
        var listArr = [];
        let _res = res.response.activityList;
        for(var i = 0;i<_res.length;i++){
         listArr.push({
          id:_res[i].id,
          url:_res[i].rfdsUrl+_res[i].activityPicList,
          act_status:_res[i].actEntryStatus,
          order_status:_res[i].orderStatus,
          title:_res[i].theme,
          price:_res[i].entryFee,
          detail:_res[i].activityAddress,
          time_start:_res[i].activityStartTime,
          time_end:_res[i].activityEndTime,
          orderNo:_res[i].orderNo,
          activityId:_res[i].id,
          })
        }
        this.list=listArr
        if(this.list.length<10){
          this.txt='没有更多活动了'
          this.loading = true
          }
      }).catch(e=>{
          // console.log(e)
      })
    },
    signOut(){
        MessageBox({
          title: '提示',
          message: '确定要退出当前账号?',
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          showCancelButton: true,
          confirmButtonClass:'txtcolor',
          cancelButtonClass:'txtcolor'
        }).then(action => {
          console.log(action)
            if(action=='confirm'){
                localStorage.removeItem('accessToken')
                localStorage.removeItem('userId')
                localStorage.removeItem('userName')
                localStorage.removeItem('mobile')
                localStorage.removeItem('headImage')
                this.$router.push({name:'Home'})
            }
          })
    
    },
    getUrl(name) {
      //截取URL
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = decodeURIComponent(window.location.href).match(reg);
      if(r!=null) return decodeURIComponent(r[2]); return '';
    },
    isLogin(){
      //登录
      let lgmoblile = localStorage.getItem('mobile')
      let url_mobile = this.getUrl('mobile')
      if(lgmoblile){
        let userId = localStorage.getItem('userId'),
            userName = localStorage.getItem('userName'),
            userMobile = localStorage.getItem('mobile'),
            headImage = localStorage.getItem('headImage')
        this.user_head = headImage
        this.user_phone = userMobile
        this.uid = userId
        this.actType.userId = userMobile
        this.user_name=userName
      }else if(url_mobile){
        let url_userId = this.getUrl('userId'),
            url_token = this.getUrl('accessToken'),
            url_name = this.getUrl('name'),
            url_mobile = this.getUrl('mobile'),
            url_headImage = this.getUrl('headImageUrl')
        localStorage.setItem('accessToken',url_token)
        localStorage.setItem('userId',url_userId)
        localStorage.setItem('userName',url_name)
        localStorage.setItem('mobile',url_mobile)
        localStorage.setItem('headImage',url_headImage)
        this.user_head = url_headImage
        this.user_phone = url_mobile
        this.uid = url_userId
        this.actType.userId =url_mobile
        this.user_name=url_name
      }
      return new Promise((res,rej)=>{
        res()
      })
    },
    //去订单详情
    orDetails(oid,aId){
      var _data={
        'activityId':oid,
        'orderNo':aId
      }
      console.log(_data)
      getOrderDetail(_data).then((res)=>{
        let orderData = '&id='+_data.activityId+'&orderNo='+_data. orderNo
        this.changeUrl('orderDetail',orderData)
        console.log(orderData)
      }).catch(e=>{
        Toast(e.msg)
      })
    },
    //去成为商户
    becomeMerchants(){
      var _url = ''
      getBusinessUserList(this.user_phone).then((res)=>{
				var rsep = res.response.businessUserList
				if(rsep){
					var result = rsep[0].reviewResult
					if(result =='pass'){
							_url ='bussinessResult&result=success'
					}else if(result =='unpass'){
							_url ='bussinessResult&result=fail'
					}else{
							_url ='bussinessResult&result=wait'
					}
				}else{
							_url = 'becomeMerchants'
				}
        
				let dataUrl ='&userId='+this.uid+'&mobile='+this.user_phone+'&name='+this.user_name;
      	this.changeUrl(_url,'')
      })
      
    }
  },

  mounted(){
    //在市民卡APP内隐藏
    if(navigator.userAgent.indexOf('smkVersion')>-1){ this.smkbtnOut=false}
    //加载单个报名状态角标
    this.isLogin().then((res)=>{
      OrderCount({userId:this.user_phone}).then((res)=>{
          this.tabsNew[2].tabNew = res.response.orderProcessing;
          this.tabsNew[1].tabNew = res.response.preOrderCount;
          this.tabsNew[4].tabNew = res.response.refundCount;
          this.tabsNew[3].tabNew = res.response.successCount;
      })
    })
    //初始化加载全部
    this.isLogin().then(res=>{
       ActivityList(this.actType).then((res)=>{
        this.list='';
        this.totalPages = res.response.totalPages;
        var listArr = [];
        let _res = res.response.activityList;
        for(var i = 0;i<_res.length;i++){
         listArr.push({
          id:_res[i].id,
          url:_res[i].rfdsUrl+_res[i].activityPicList,
          act_status:_res[i].actEntryStatus,
          order_status:_res[i].orderStatus,
          title:_res[i].theme,
          price:_res[i].entryFee,
          detail:_res[i].activityAddress,
          time_start:_res[i].activityStartTime,
          time_end:_res[i].activityEndTime,
          orderNo:_res[i].orderNo,
          activityId:_res[i].id,
          })
        }
        this.list=listArr
        // this.list=res.response
      }).catch(e=>{
        // Toast(e.msg)
      })
    })
    // !localStorage.getItem('mobile')? this.$router.push({name:'Home'}):''
    // if(!localStorage.getItem('mobile')){
    //     let _herf= window.location.href
    //     location.href = URL.loginUrl+'url='+ encodeURIComponent(_herf) + '&clientCode=' + URL.bsNumber 
    // }
    
  },
 
  destroyed(){
    $('#app').removeClass('un')
  },
}

</script>

<style scoped lang='less'>
.inner-block{
  height:100%;
  overflow-y:scroll;
  -webkit-overflow-scrolling: touch;
}
.user-page{
  background-color: #f6f6f6;
}
.page-loading{
  text-align: center;
  padding-bottom: 15px;
  padding-top: 15px;
}
.noresult{
    margin-bottom: 20px;
    font-size: 15px;
    color: #888;
    text-align: center;
} 
.header{
  height: 110px;
  color: #fff;
  padding: 10px 20px;
  background: url('../assets/images/my_bg.png') center center;
}
.rt-intro{
  text-align: right;
  font-size: 15px;
}
.user-info{
  overflow:hidden;
  .lt-img{
    float: left;
    margin: 0 10px;
    width: 50px;
    height: 50px;
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .rt-text{
    float: left;
    .rt-phone{
      line-height: 1;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .out-btn{
      padding: 4px 16px;
      border-radius: 20px;
      background: #53ae51;
      color: #fff;
      font-size: 12px;
    }
  }
}
.tabs{
  margin-bottom: 6px;
  background-color: #fff;
}
.tab-item{
  float: left;
  width: 16%;
  padding: .2rem 0;
  border-bottom: 2px solid #fff;
  text-align: center;
  position: relative;
  &.active{
    border-color: #2ba728;
  }
  .tab-title{
    font-size: 10px;
    line-height: 1.2;
    text-align: center;
  }
  .badge{
    position: absolute;
    top: .15rem;
    right: .15rem;
    background: #fff;
    color: #ff5400;
    border: 1px solid #ff5400;
    padding: 5px 4px 2px 4px;
    border-radius: 8px;
    line-height: 8px;
  }
}
.act-list{
  padding:  0 0.24rem;
  background-color: #fff;
}
.blank{
  padding: 10vh 0;
  .blank-pic{
    display: block;
    width: 60%;
    margin:auto;
  }
}
.act-item{
  padding: 10px 0 10px 120px;
  position: relative;
  border-bottom: 0.5px solid #e7e7e7;
}
.act-img{
  position: absolute;
  top: 10px;
  left: 0;
  width: 110px;
  height: 110px;
  img{
    width: 100%;
    height: 100%;
  }
  .sign-in{
    width: 100%;
    height: 22px;
    line-height: 22px;
    color: #fff;
    font-size: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    &.doing{
      background: url('../assets/images/user-list_jxz.png') center center;
      background-size: 100%;
    }
    &.end{
      background: rgba(0,0,0,.6);
    }
  }
}
.gt-info{
  height: 90px;
  font-size: 12px;
}
.gt-title{
  padding-right: 60px;
  position: relative;
  font-size: 15px;
  color: #333;
  font-weight: bold;
  min-height: 19px;
  max-height: 38px;
  line-height: 19px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  .price{
    color:#ff5400;
    font-weight: bold; 
    position: absolute;
    top: 0;
    right: 0;
  }
  .shallow{
    color:rgb(255,193,163);
  }
}
.detail{
  color: #888;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.time-range{
  color: #888;
  span{
    display: inline-block;
  }
}
.order-status{
  font-size: 13px;
}

.icon{
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-top: 8px;
  background: url('../assets/images/user-tabs.png');
  background-size: auto 100%;
  &.icon-qb{ background-position: 0 0 }
  &.icon-dzf{ background-position: -30px 0 }
  &.icon-clz{ background-position: -60px 0 }
  &.icon-bm{ background-position: -90px 0 }
  &.icon-tk{ background-position: -120px 0 }
  &.icon-qx{ background-position: -150px 0 }
}

</style>
