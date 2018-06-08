<template>
  <div class="block">
    <div class="container" id='container'>
       <router-view/>
    </div>
    <div class="footer">
      <ul class="clearfix">
        <li class="tabs" @click='changeTab(1)' :class='tabName=="Home"?"isactive":""'>
          <i class="icon"><span :class="[isactive?'icon-bg bghome':'icon-bg-active bghome-active']"></span></i>
          <p class="title">首页</p>
        </li>
        <li class="tabs" @click='changeTab(2)' :class='tabName=="User"?"isactive":""'>
          <i class="icon"><span :class="[isactive?'icon-bg-active bgme-active':'icon-bg bgme']"></span></i>
          <p class="title">我的订单</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {getUserIdByToken} from '@/http/ajax'
import URL from '@/http/com.js'
export default {
  data () {
    return {
      tabName:'',
      appToken:'',
      isactive:false,
    }
  },
  methods:{
      goH5login(){
          let _herf= window.location.href.split('/Home')[0]+'/User'
          location.href = URL.loginUrl+'url='+ encodeURIComponent(_herf) + '&clientCode=' + URL.bsNumber 
      },
      getUrlParam(name) {
          var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
          var usefulInfo = window.location.href.split('?')[1];
          if (usefulInfo) {
             var r = usefulInfo.match(reg);
          }
          if (r != null) {
              return decodeURIComponent(r[2]);
          }
          return null;
      },
    changeTab(n){
      if(n==1){
        this.isactive = false;
        this.$router.push({name:'Home'})
      }else if(n==2){
        this.isactive = true;
        let lgmoblile = localStorage.getItem('mobile')
        let url_mobile = this.getUrlParam('mobile')
        if(lgmoblile){
          let userId = localStorage.getItem('userId'),
              userName = localStorage.getItem('userName'),
              userMobile = localStorage.getItem('mobile'),
              headImage = localStorage.getItem('headImage')
              this.$router.push({name:'User'})
        }else if(url_mobile){
          let url_userId = this.getUrlParam('userId'),
              url_name = this.getUrlParam('name'),
              url_mobile = this.getUrlParam('mobile'),
              url_headImage = this.getUrlParam('headImageUrl')
              localStorage.setItem('accessToken',url_token)
              localStorage.setItem('userId',url_userId)
              localStorage.setItem('userName',url_name)
              localStorage.setItem('mobile',url_mobile)
              localStorage.setItem('headImage',url_headImage)
               this.$router.push({name:'User'})
        }else{
          let _herf= window.location.href.split('/Home')[0]+'/User'
          location.replace( URL.loginUrl+'url='+ encodeURIComponent(_herf) + '&clientCode=' + URL.bsNumber )
          // location.href = URL.loginUrl+'url='+ encodeURIComponent(_herf) + '&clientCode=' + URL.bsNumber 
        }
      }
    },
    checkRoute(){
      const reg = /^\/\w+/
      let array = this.$route.path.match(reg)
      if(array) {
        this.tabName = array[0].substr(1)
      }else{
        this.tabName = ''
      }
    },
    wathPage(){
        var path
        let page = this.$route.path
        let mat = page.match(/\/\w+/)
        if(mat[0]) var path = mat[0].substr(1)
        path =='Home'?this.isactive = false:this.isactive = true
    }
  },  
  watch:{
    $route (){
      this.checkRoute()
      this.wathPage();
      if(this.isactive && !localStorage.getItem('mobile')){
        this.goH5login()
      }
    },
    
  },
  created(){
    //获取浏览器/APP的版本
    var u = navigator.userAgent;
    let _herf=window.location.href;
    let token=this.$route.query.token;
        if(token){
            localStorage.setItem('accessToken',token);
            getUserIdByToken({accessToken:token}).then((res)=>{
              localStorage.setItem('userId',res.response.userId)
              localStorage.setItem('mobile',res.response.mobile)
              localStorage.setItem('userName',res.response.name)
              localStorage.setItem('idCard',res.response.idCard)
            })
        }else if(u.indexOf('smkVersion')>-1){
          //市民卡APP登陆
          //异常没传递token  调用APPH5登录方法
              jsBridge.getToken(function (token) {
                    this.appToken=token;
                    if(this.appToken){
                      getUserIdByToken({accessToken:this.appToken}).then((res)=>{
                        localStorage.setItem('userId',res.response.userId)
                        localStorage.setItem('mobile',res.response.mobile)
                        localStorage.setItem('userName',res.response.name)
                        localStorage.setItem('idCard',res.response.idCard)
                      })
                    }
                  })
        }
  },
  mounted(){
    this.checkRoute()
    this.wathPage()
    //回到首页获取登录信息
    if(this.getUrlParam('mobile')){
        localStorage.setItem('userId',  this.getUrlParam('userId'))
        localStorage.setItem('mobile',  this.getUrlParam('mobile'))
        this.getUrlParam('ADTAG')=='smkwx'?localStorage.setItem('userName',''):localStorage.setItem('userName',this.getUrlParam('name'))
    }
    if(window.location.href.indexOf('ADTAG')>-1){
      localStorage.setItem('ADTAGTYPE',this.getUrlParam('ADTAG'))
    }
  }
}
</script>
<style scoped lang='less'>
.block{
  height: 100%;
  overflow: hidden;
  position: relative;
  padding-bottom: 45px;
}
.container{
  height: 100%;
}

.footer{
  height: 45px;
  position: absolute;
  bottom: 0;
  left:0;
  right: 0;
  background-color: #fff;
  z-index: 99
}
.tabs{
  height: 100%;
  width: 50%;
  float: left;
  border-top: 1px solid #d2d2d2;
  text-align: center;
  color: #2BA728;
  /*&.isactive{
    color: #929292;
  }*/
  .icon{
    display: inline-block;
    width:22px;
    height: 22px;
    position: relative;
    margin-top: 4px;
    z-index: 120;
   .icon-bg{
     width: 22px;
     height:22px;
     position: absolute;
     bottom: 0;
     left:0;
   }
   .bghome{
     background: url('../assets/images/home.png') no-repeat;
     background-position: 0 0;
     background-size:100%
   }
   .bgme{
     background: url('../assets/images/me.png') no-repeat;
     background-position: 0 0;
     background-size:100%
   }
   .icon-bg-active{
     width: 44px;
     height:44px;
     position: absolute;
     bottom: -4px;
     left:-11px;
   }
   .bghome-active{
     background: url('../assets/images/home1.png') no-repeat;
     background-position: 0 0;
     background-size:100%
   }
   .bgme-active{
     background: url('../assets/images/me1.png') no-repeat;
     background-position: 0 0;
     background-size:100%
   }
  }
  .title{
    font-size: 10px;
    line-height: 1;
    margin-top: -2px;
    color: #2BA728;
    
  }
}
</style>
