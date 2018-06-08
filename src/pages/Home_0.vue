<template>
  <div  class="block-page" id='scrollPage'>
    <mt-loadmore 
    :top-method="loadTop" 
    ref="loadmore" 
    :topDistance='30'
    @top-status-change="topChange">
    <div slot="top" class="mint-loadmore-top">
      <span v-show="searchStatus === 'pull'" :class="{ 'rotate': searchStatus === 'pull' }">下拉刷新</span>
      <span v-show="searchStatus === 'drop'" :class="{ 'rotate': searchStatus === 'drop' }">松开刷新</span>
      <span v-show="searchStatus === 'loading'">正在刷新...</span>
    </div>
  <div class='relative'>

    <!-- 导航栏 -->
    <div 
      id='top_bar'
      class="top-bar" 
      :style='`background-color:rgba(255,255,255,${searchStyle})`'
       ref = 'topBar'>
     <p class="top-lt" @click='closeWeb'><i class="iconfont icon-back" :style='`color:rgb(${searchIcon},${searchIcon},${searchIcon})`'></i></p>
     <div class="top-gt">
      <div class="input-box">
        <p class="search-icon"><i class="iconfont icon-sousuo"></i></p>
        <div class="search-text">
          <p 
          v-if='searchList.length>0'
          @click='searchTap(searchList[textScroll])'>{{searchList[textScroll].content}}</p>
        </div>
      </div>
     </div>
    </div>
    <!-- banner -->
    <div class="top-banner" ref = 'banner'>
      <mt-swipe 
      class='SMK'
      :auto="4000"
      :showIndicators='bannerList.length>1'>
        <mt-swipe-item 
        v-for='(i,x) in bannerList' 
        :key='x'><img class="banner-img" :src="i.url" @click='skipBan(i.href)' alt="轮播图"></mt-swipe-item>
      </mt-swipe>
    </div>
    <!-- 类型 -->
    <div class="top-category" v-if='!!categoryList.length'>
      <ul class="clearfix">
        <li 
        class="top-category-item"
        v-for='(i,x) in categoryList'
        :key='x'
        @click='skipCategory(i.id)'>
          <i class="cate-icon"><img :src="i.icon" alt="分类"/></i>
          <p class="cate-title">{{i.title}}</p>
        </li>
        <li 
        v-if='enterAll'
        class="top-category-item"
        @click='skipCategory(-1)'>
          <i class="cate-icon"><img src="../assets/images/icon-categpry_all.png" alt="分类"/></i>
          <p class="cate-title">全部</p>
        </li>
      </ul>
    </div>
    <!-- 网友动态 -->
    <div class="act-action" v-if='!!nearest.length'>
      <div class="action-logo">
        <i class="user-action-pic"></i>
      </div>
      <div class="action-marquee">
        <text-scroll 
          :dataList='nearest' 
          :playTime='3000'
          @tapNote='nearestTap'>
          <template slot-scope='scoped'>
            <div class="marq-text">
              <p class="marq-title"><i class="marq-icon"><img :src="scoped.row.icon||'./static/img/default-nearest.png'" alt=""></i>{{scoped.row.userId}}刚刚报名参加了</p>
              <p class="marq-title text-overflow">{{scoped.row.theme}}</p>
            </div>
          </template>
        </text-scroll>
      </div>
      <div class="action-to-more"><i class="iconfont icon-jinru2"></i></div>
    </div>
    <!-- 专题 -->
    <div class="act-special" v-if='special.main.length>0'>
      <ul class="clearfix">
        <!--  -->
        <li class="special-item">
          <div class="act-block" @click='skipAct(special.main[0].activityId)'>
            <div class="spe-down-bg">
              <img :src="special.main[0].main_pic" alt="">
              <span class="special-fix-title" v-if="special.main[0].main_head">{{special.main[0].main_head}}</span>
            </div>
            <div class="spe-info">
              <div class="special-time" v-if='special.main[0].countType!="N"'>
                <div class="time-count">
                  <span v-if='special.main[0].countType=="entry"'>距离报名开始</span>
                  <span v-if='special.main[0].countType=="end"'>距离报名结束</span>
                  <time-count 
                  :c='special.main[0].c'
                  :s='special.main[0].s'
                  :e='special.main[0].e'
                  @finish='timeFinish(0)'/>
                </div>
              </div>
              <div class="spe-text">
                <p class="spe-text-title">{{special.main[0].title}}</p>
                <p class="spe-price">&yen;{{special.main[0].price[0]}} <span v-if='special.main[0].price.length>1' style="font-size: 10px;">起</span></p>
              </div>
            </div>
          </div>
        </li>
        <!--  -->
        <li class="special-item gt">
          <div class="act-block" v-if='special.main.length>1' @click='skipAct(special.main[1].activityId)'>
            <div class="spe-down-bg">
              <img :src="special.main[1].main_pic" alt="">
              <span class="special-fix-title" v-if="special.main[1].main_head">{{special.main[1].main_head}}</span>
            </div>
            <div class="spe-info">
              <div class="special-time" v-if='special.main[1].countType!="N"'>
                <div class="time-count">
                  <span v-if='special.main[1].countType=="entry"'>距离报名开始</span>
                  <span v-if='special.main[1].countType=="end"'>距离报名结束</span>
                  <time-count 
                  :c='special.main[1].c'
                  :s='special.main[1].s'
                  :e='special.main[1].e'
                  @finish='timeFinish(1)'/>
                </div>
              </div>
              <div class="spe-text">
                <p class="spe-text-title">{{special.main[1].title}}</p>
                <p class="spe-price">&yen;{{special.main[1].price[0]}} <span v-if='special.main[1].price.length>1' style="font-size: 10px;">起</span></p>
              </div>
            </div>
          </div>
          <template v-else>
            <div 
              v-for='i in special.aside'
              class="special-gt-block" 
              :key='i.activityId'
              @click='skipSpecial(i.activityId,i.topicCode)'>
              <img :src="i.url" alt="">
              <p class="spe-aside-name corn">{{i.name}}</p>
            </div>  
          </template>
          
        </li>

      </ul>
    </div>
    <!-- ad. -->
    <div class='act-pop' v-if='!!adList.length'>
      <div class="pop-block">
        <mt-swipe 
        class='Join_banner'
        :showIndicators='adList.length>1'
        :auto="3500">
          <mt-swipe-item v-for='(i,x) in adList' :key='x'>
            <div class="pop-img">
            <img :src="i.url" alt="pop" @click='skipAd(i.link)'></div>
          </mt-swipe-item>
        </mt-swipe>
      </div>
    </div>
    <!-- hot -->
    <div class="act-hot" v-if='!!hotList.length'>
      <h4 class="hot-title">
        <span>热门活动榜</span>
        <span class="gt-more" @click='skipHot'>查看全部榜单 <i class="iconfont icon-jinru2"></i></span>
      </h4>
      <ul class="hot-box clearfix">
        <li 
        class="hot-item" 
        v-for='(i,idx) in hotList'
        :class='idx%2==1?"hot-item-gt":""'
        @click='skipHotAct(i.id)'>
          <span v-if="idx<3" class="hot-top" :class='`t${idx+1}`'>TOP.{{idx+1}}</span>
          <img class="hot-img" :src="i.url">
          <div class="hot-info">
            <p class="hot-title">{{i.title}}</p>
            <p class="hot-time">
              <span><i class="iconfont icon-shijian"></i>{{i.time_range}}</span>
              <span class="gt-num">{{i.sign_num}}人报名</span>
            </p>
            <p class="hot-price">&yen;{{i.price[0]}} <span v-if='i.price.length>1' class='small'>起</span></p>
          </div>
        </li>
      </ul>
    </div>
    <!-- recommend -->
    <!-- <recommend v-if='likeList' ref='like' :partId='partId.Like'/> -->
    <div class="fix-recommend" v-if='likeList.length>0'>
      <h2 class="rec-title">精选活动</h2>
      <div class="holder"
          ref='tab'>
        <ul 
          class="rec-tab" 
          :class='isFixed>0?"isfixed":""'
          :style='`top:${isFixed}px`'>
          <li 
            v-for='( item , i ) in likeList' 
            class="rec-tab-item" 
            :key='i'
            :class='tabId==i?"isactive":""'
            @click='changeTab(i)'
            >{{item.name}}</li>
        </ul>
      </div>
      <div>
        <div
          v-for='( item , i ) in likeList'
          :key='i'
          class="rec-section">
          <h4 class="section-head" v-if='i>0'>
            <span class="section-title">{{item.name}}</span>
          </h4>
          <div class="clearfix" :ref='`list`' >
            <div 
              class="section-border" 
              v-for='(list , idx) in item.list'
              :key='idx'
              @click='skipLikeDetail(list.activityId)'>
              <action 
                :status='list.status'
                :signLimit='list.isEntry'
                :src='list.url'
                :title='list.title'
                :area='list.area'
                :sign_num='list.sign_num'
                :time_range='list.time_range'
                :price='list.price'
                :c='list.current'
                :s='list.sdt'
                :e='list.edt'
              ></action>
            </div>
          </div>
          <div class="after-more">
            <p class="more-text" @click='skipMore(item.id,item.name)'>查看更多{{item.name}}活动<i class="iconfont icon-jinru2"></i></p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </mt-loadmore>
  </div>
</template>

<script>
import $ from 'jquery'
import { Swipe, SwipeItem, Loadmore,Toast } from 'mint-ui';
import Action from '../components/action';
import TextScroll from '../components/marquee';
import Recommend from '../components/recommend';
import timeCount from '../components/timeCount'
import { getSearch,getBanner,getActivityType,getPart,getLikeList } from '../http/sdk';
import { addScanRecord } from '../http/ajax';
import { mdTime , mdFormat } from '@/util'

export default {
  components:{
    [Swipe.name]:Swipe,
    [SwipeItem.name]:SwipeItem,
    [Loadmore.name]:Loadmore,
    [Toast.name]:Toast,
    'action':Action,
    'text-scroll':TextScroll,
    'recommend':Recommend,
    'time-count':timeCount
  },
  data () {
    return {
      searchStyle:0,
      searchStatus:'',    // 搜索框滚动比例
      textScroll:0,       // 文字滚动序号
      time:'',            // 定时器
      searchList:[],
      bannerList:[],      // banner
      enterAll:true,      // 是否展示全部分类
      categoryList:[],    // 分类
      adList:[],          // 广告
      nearest:[],         // 网友去哪里了
      special:{
        main:[],
        aside:[],
      },                  // 专题
      hotList:[],         // 热门榜单
      likeList:false,     // 猜你喜欢
      partId:{},          // 板块id

      isFixed:0,
      tabId: 0,
      likeList:[],        // 猜你喜欢
    }
  },
  computed:{
    searchIcon(){
      let n = parseFloat(this.searchStyle)
      return 255-100*(n)
    },
  },
  methods:{
    loadTop(){
      // 下拉刷新
      clearInterval(this.time)
      this.textScroll=0
      this.getBefore().then((res)=>{
        this.getBase()
        setTimeout(()=>{
          this.$refs.loadmore.onTopLoaded();
        },1000)
      })
    },
    topChange(s){
      // 下拉状态
      this.searchStatus = s
    },
    searchTap(n){
      // 搜索框 跳转
      console.log(n)
      this.$router.push({name:'Search',query:{searchContent:n.content}})
    },
    nearestTap(n){
      // 网友去哪里 跳转 详情
      console.log(n)
      addScanRecord('nearest',n.id)
      this.changeUrl('detail',`&id=${n.id}`)
    },
    skipBan(href){
      // banner 跳转
      console.log(href)
      if(!href) return ;
      let h = href
      let user_info = '',url=''
      if(href.indexOf('?')>0){
        h = href+'&'
      }else{
        h = href+'?'
      }
      if (localStorage.getItem('mobile')){
          var mobile = localStorage.getItem('mobile')||''
          var userId = localStorage.getItem('userId')||''
          var userName = localStorage.getItem('userName')||''
          user_info = 'mobile=' + mobile + '&userId=' + userId + '&name=' + userName
          url = h + user_info
      }else{
          url = h + 'islogin=N'
      }
      location.href = url
    },
    skipAd(url){
      // link 跳转
      if(url) {
        location.href = url
      }
    },
    skipCategory(id){
      // 分类页面 跳转
      if(id==-1) {
        this.$router.push({name:'CategoryAll'})
      }else{
        this.$router.push({name:'CategoryList',query:{code:id}})
      }
    },
    skipSpecial(id,tc){
      // 专题页面 跳转
      let adtag = this.$route.query.ADTAG
      let query = adtag?{code:id,ADTAG:`${adtag}.${tc}`}:{code:id}
      this.$router.push({name:'Special',query})
    },
    timeFinish(i){
      this.special.main[i].countType="N"
    },
    skipHot(){
      // 热门页面 跳转
      this.$router.push({name:'HotList',query:{'partId':this.partId.Hot}})
    },
    skipAct(id){
      // 精品活动
      console.log(id)
      addScanRecord('activity',id)
      this.changeUrl('detail',`&id=${id}`)
    },
    skipHotAct(id){
      // 热门活动
      addScanRecord('hot',id)
      this.changeUrl('detail',`&id=${id}`)
    },
    skipMore(id,name){
      // 查看更多
      this.$router.push({name:'MoreList',query:{listId:id,listName:name}})
    },
    skipLikeDetail(id){
      addScanRecord('like',id)
      this.changeUrl('detail',`&id=${id}`)
    },
    handleScroll () {
      let scrollTop = $(this.scrollBox).scrollTop()
      let th = this.topBarHeight
      
      // title
      let hg = this.$refs.banner.offsetHeight - th
      let percent = (scrollTop / hg).toFixed(2)
      if(percent<=1){
        this.searchStyle = percent
      }else{
        this.searchStyle = 1
      }

      // like
      let topBar = this.$refs.tab.offsetTop - th
      if(!this.$refs.list) {return }
      let lh = this.$refs.list.map(i=>{
        return i.offsetTop - th - 50
      })
      if (scrollTop > topBar){
        this.isFixed = th
      } else {
        this.isFixed = 0
      }
      if(scrollTop >= lh[0] && scrollTop < lh[1]){
        this.tabId = 0
      }else if(scrollTop >= lh[1] && scrollTop < lh[2]){
        this.tabId = 1
      }else if(scrollTop >= lh[2] && scrollTop < lh[3]){
        this.tabId = 2
      }else if(scrollTop >= lh[3]){
        this.tabId = 3
      }
    },
    changeTab(i){
      let offset_top = this.$refs.list[i].offsetTop - this.topBarHeight - 50
      $(this.scrollBox).animate({scrollTop: offset_top}, 200,()=>{
        setTimeout(()=>{this.tabId = i},0)
      })
    },
    getBefore(){
      let mobile = localStorage.getItem('mobile')||''
      let promise = getPart(mobile).then((res)=>{
        let list = res.response.hpList
        let data = {}
        console.log(list)

        // nearest-网友去哪了
        // nearestAdd-网友去哪了后台添加
        // banner-广告页
        // activity-精品活动
        // topic-专题
        // hot-热门活动榜
        // like-猜你喜欢
        // dynamic-动态推广

        list.forEach(i=>{
          switch (i.type) {
            case 'nearest': data.nearest = i;break;
            case 'banner': data.ad = i;break;
            case 'topic': data.topic = i;break;
            case 'hot': data.hot = i;break;
            case 'like': data.like = i;break;
            case 'dynamic': data.dynamic = i;break;
          }
        })
        if(data.nearest){
          if(data.nearest.partList.length<=0) return;
          this.nearest = data.nearest.partList.map(i=>{
            let hide = ''
            if(i.userId){
              hide = i.userId.substr(0, 3) + '****' + i.userId.substr(7);
            }
            return {
              id:i.activityId,
              activityId:i.activityId,
              userId: hide,
              theme:i.theme,
            }
          })
        }
        if(data.topic){
          let special = {},
            main =[],
            aside=[],
            rfdsUrl = data.topic.rfdsUrl
          data.topic.partList.forEach(i=>{
            if(i.type==="activity"){
              let act = {
                activityId : i.activityId,
                main_head : i.label,
                main_pic : rfdsUrl + i.imgUrl,
                title : i.theme,
                price : i.entryFee.split('-').map(i=>i.replace('.0','')),
                countType: i.countDownType,
                c:i.currentMills,
                s:i.entryStartTime,
                e:i.entryEndTime,
              }
              main.push(act)
            }else if(i.type==="topic"){
              aside.push({
                activityId:i.activityId,
                url:rfdsUrl + i.imgUrl,
                name : i.theme,
                topicCode : i.topicCode,
              })
            }
          })
          special.main = main
          special.aside = aside
          this.special = special
        }
        if(data.ad){
          let rfdsUrl = data.ad.rfdsUrl
          this.adList = data.ad.partList.map(i=>{
            return {
              id:i.id,
              url: rfdsUrl + i.imgUrl,
              link:i.linkUrl||'',
            }
          })
        }
        if(data.hot){
          let info = data.hot.partList.slice(0,4),
            rfdsUrl = data.hot.rfdsUrl,
            list = info.map(i=>{
              let time_range = mdTime(i.activityStartTime,i.activityEndTime)
              return {
                id:i.activityId,
                title:i.theme,
                url: rfdsUrl + i.activityHotPic,
                time_range,
                sign_num: i.requestNumFront,
                price: i.entryFee.split('-').map(i=>i.replace('.0',''))
              }
          })
          this.partId.Hot = data.hot.id
          this.hotList = list
        }
        if(data.like) {
          this.likeList = true;
          this.partId.Like = data.like.id
        }
        return new Promise((resolve=>{
          resolve()
        }))
      }).catch((e)=>{
        console.log(e)
        Toast(e.msg)
      })
      return promise
    },
    getBase(){
      let p_s = new Promise((resolve,reject)=>{
        getSearch('theme').then((res)=>{
          let data = res.response.themeList
          if(!data||data.length<=0) return;
          let list = data.map(i=>{
            return {
              id:i.id,
              content:i.content
            }
          })
          this.searchList = list
          let i = 0
          resolve()
          this.time = setInterval(()=>{
            if(i<list.length-1){
              i++
            }else{
              i=0
            }
            this.textScroll = i
          },5000)
        }).catch(e=>{
          console.log(e)
          reject(e)
        })
      })
      
      let p_b = new Promise((resolve,reject)=>{
        getBanner().then((res)=>{
          let data = res.response.bannerList
          if(!data||data.length<=0) return;
          this.bannerList = data.map(i=>{
            return {
              id:i.id,
              url:i.rfdsUrl+i.picUrl,
              href:i.url,
              status:i.status
            }
          })
          resolve()
        }).catch(e=>{
          console.log(e)
          reject(e)
        })
      })
      

      let p_t = new Promise((resolve,reject)=>{
        getActivityType('Y').then((res)=>{
          let data = res.response.typeList
          if(!data||data.length<=0) return;
          let list = data.map(i=>{
            return {
              title:i.actTypeName,
              icon:i.rfdsUrl + i.icoUrl,
              id:i.actTypeCode
            }
          })
          if(list.length<=8){
            this.enterAll = false
          }else{
            list.splice(7,list.length-7)
            this.enterAll = true
          }
          this.categoryList = list
          resolve()
        }).catch(e=>{
          console.log(e)
          reject(e)
        })
      })

      let p_l = new Promise((resolve,reject)=>{
        let mobile = localStorage.getItem('mobile')||''
        let pid = this.partId.Like
        getLikeList(pid,mobile).then((res)=>{
          let data = res.response.likeTypeList,
            sys = res.systemDate
          let info = []
          for(let i in data){
            let o = data[i].actvityList
            let id = o[0].type,
              name = o[0].actTypeName
            let d = o.map(i=>{
              let time_range = mdTime(i.activityStartTime,i.activityEndTime)
              let cr = i.countDownType=='N'?0:i.currentMills
              return {
                activityId:i.activityId,
                url:i.rfdsUrl + i.activityPicList,
                title:i.theme,
                area:i.activityArea,
                sign_num:i.requestNumFront,
                time_range,
                price:i.entryFee,
                isEntry:i.entryNumFull,
                status:i.actEntryStatus-0,
                current:cr,
                sdt:i.entryStartTime||'',
                edt:i.entryEndTime||'',
              }
            })
            info.push({
              name,
              id,
              list:d
            })
          }
          this.likeList = info
          console.log(this.likeList)
          resolve()
        }).catch(e=>{
          console.log(e)
          reject(e)
        })
      })
      
      Promise.all([p_s,p_b,p_t,p_l]).then((res)=>{
        console.log('yes')
        // Toast('加载完成')
      },(rej)=>{
        console.log('error')
        Toast(rej.msg)
      })
    },
  },
  mounted () {
    // sdk
    this.getBefore().then((res)=>{
      // Toast('加载完成')
      $('#app').addClass('un')
      this.getBase()
    })

    // scroll
    let scrollBox = document.getElementById('scrollPage')
    this.scrollBox = scrollBox
    this.topBarHeight = document.getElementById('top_bar').offsetHeight
    scrollBox.addEventListener('scroll', this.handleScroll);
  },
  destroyed(){
    $('#app').removeClass('un')
    this.scrollBox.removeEventListener('scroll', this.handleScroll)
  },
}

</script>

<style scoped lang="less">
.block-page{
  height: 100%;
  overflow-y: scroll;
}
.mint-loadmore-top{
  position: absolute;
  top: -50px;
  left: 0;
  right: 0;
  margin-top:0;
  text-align: center;
}
.relative{
  position: relative;
}
.top-bar{
  /*height: 44px;*/
  padding-left: 40px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: rgba(0,0,0,0);
  -webkit-backface-visibility: hidden;
  transform: translate3d(0,0,0);
  &.searchIndi:after{
    content:'';
    display: block;
    width: 100%;
    height: 0;
    border-top: 1px solid #ededed;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
.top-lt{
  width: 40px;
  line-height: 44px;
  color: #666;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  .iconfont{
    color: #fff;
  }
}
.top-gt{
  width:100%;
  height: 44px;
  padding: 0.16rem 0.3rem 0.16rem 0;
  line-height: 28px;
}
.input-box{
  width: 100%;
  background-color:rgba(248,248,248,0.75);
  height:100%;
  line-height: 28px;
  border-radius: 28px;
  overflow: hidden;
  .search-icon,.search-text{
    float: left;
  }
  .search-icon{
    margin:0 7px 0 15px;
    line-height: 30px;
  }
  .search-text{
    width: 4.5rem;
    height: 28px;
    line-height: 28px;
    font-size:14px;
    color: #999;
  }
}
.top-banner{
  height: 2.8rem;
  .banner-img{
    width: 100%;
    height: 100%;
  }
}
.top-category{
  padding: 0.2rem;
  .top-category-item{
    float: left;
    width: 25%;
    padding: 0.14rem 0;
    text-align: center;
    .cate-icon{
      width: 45px;
      height: 45px;
      display: block;
      margin: auto;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .cate-title{
      line-height: 20px;
    }
  }
}
.act-action{
  padding: 8px 0;
  height: 66px;
  overflow: hidden;
}
.action-logo{
  float: left;
  width:1.7rem;
  padding: 0 0.3rem;
  .user-action-pic{
    display: block;
    width: 1.3rem;
    height: 0.9rem;
    background: url('../assets/images/icon-user-action.png') center center;
    background-size: 100%; 
  }
}
.action-marquee{
  float: left;
  width: 5.1rem;
  height: 100%;
  overflow: hidden;
}
.action-to-more{
  float: right;
  width: 0.7rem;
  padding-right: 0.3rem;
  height: 100%;
  font-size: 10px;
  line-height: 1rem;
  text-align: right;
}
.marq-text{
  font-size:14px;
  line-height: 22px;
  .marq-title{
    vertical-align: middle;
    width: 100%;
  }
  .marq-icon{
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-right: 4px;
    vertical-align: text-bottom;
    border-radius: 22px;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
.act-special{
  padding: 0.3rem;
}
.special-item{
  width: 49%;
  height: 2.6rem;
  float: left;
  position: relative;
  &.gt{
    float: right;
  }
  .act-block{
    width: 100%;
    height: 100%;
    box-shadow: 0 2px 12px 0px #D9D9D9;
    border-radius: 2px;
  }
}
.spe-down-bg{
  width: 100%;
  height: 100%;
  position: relative;
  img{
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 2px;
    overflow: hidden;
  }
}
.special-fix-title{
  display: block;
  width: 48px;
  height: 23px;
  background: url('../assets/images/fix_label.png') no-repeat;
  background-size: 100%;
  text-align: center;
  line-height: 24px;
  color: #fff;
  font-size: 10px;
  position: absolute;
  top: 0.3rem;
  left: -0.05rem;
}
.spe-info{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  .special-time{
    width: 100%;
    height: 0.9rem;
    position: relative;
    background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.5));
    .time-count{
      color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 8px;
      padding: 0.12rem 0;
      .tm i{
        color: #fff;
      }
    }
  }
  .spe-text{
    padding: 0.05rem 0.1rem 0.1rem;
    font-size:13px;
    line-height:19px;
    background-color: #fff;
    .spe-text-title{
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .spe-price{
      color: #F45050;
      height: 24px;
      line-height: 24px;
    }
  }
}
.small{
  font-size: 14px;
}
.special-gt-block{
  width: 100%;
  height: 1.27rem;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0px #D9D9D9;
  &:first-child{
    top:0;
  }
  img{
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 2px;
    overflow: hidden;
    position: absolute;
    top: 0;
    left:0;
    z-index: -1;
  }
  .spe-aside-name{
    color: #fff;
    font-size: 14px;
    padding: 0.15rem 0.2rem;
  }
}
/**/
.act-pop{
  padding: 0.2rem 0.2rem;
  .pop-block{
    height: 1.6rem;
    .pop-img{
      overflow: hidden;
      width: 100%;
      height: 100%;
      padding: 0 2px;
      img{
        /*border-radius: 0.78rem;*/
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}
/**/
.act-hot{
  padding: 0.3rem;
}
.hot-title{
  font-size: 19px;
  line-height: 26px;
  .gt-more{
    color: #666;
    font-size: 12px;
    float: right;
    .iconfont{
      font-size: 12px;
    }
  }
}
.hot-box{ 
  margin-top: 0.3rem;
}
.hot-item{
  float: left;
  width: 49%;
  margin: 0.1rem 0; 
  position: relative;
  z-index: 2;
  box-shadow: 0px 2px 12px 0px #D9D9D9;
  border-radius: 3px ;
  /*overflow: hidden;*/
  &.hot-item-gt{
    float: right;
  }

  .hot-top{
  width: 43px;
  height:20px;
  position: absolute;
  left: 0;
  top:0;
  z-index: 9;
  background: url('../assets/images/icon-hotList_rank_1.png') no-repeat 0 0;
  background-size:43px 20px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  font-size: 10px;
  &.t2{
    background-image:url('../assets/images/icon-hotList_rank_2.png');
  }
  &.t3{
    background-image:url('../assets/images/icon-hotList_rank_3.png');
  }

}
  .hot-img{
    display: block;
    border-radius: 3px 3px 0 0;
    width: 100%;
    height: 2rem;
  }
  .hot-info{
    padding: 0.1rem;
    .hot-title{
      font-size: 15px;
      overflow:hidden; 
      white-space:nowrap; 
      text-overflow:ellipsis;
    }
    .hot-time{
      font-size: 12px;
      color: #666;
      .iconfont{
        font-size: 12px;
        color: #b1b1b1;
        margin-right: 0.06rem;
      }
      .gt-num{
        float: right;
        font-size: 10px;
      }
    }
    .hot-price{
      color: #F45050;
      font-size: 18px;
    }
  }
}
.small{
  line-height: 10px;
  margin-top: 4px;
  b{
    width: 12px;
    height: 13px;
    line-height: 13px;
    text-align: center;
    display: inline-block;
    color: #fff;
    background: url('../assets/images/icon-act-time_b.png');
    background-size: 100%;
    &.s{
      background-image: url('../assets/images/icon-act-time_s.png');
    }
  }
  i{
    font-size: 5px;
    color: #666;
  }
}

/*like*/
.fix-recommend{
  padding: 0 0.3rem;
  .rec-title{
    font-size: 19px;
    line-height: 26px;
  }
}
.holder{
  height: 52px;
  position: relative;
  .rec-tab{
    width: 100%;
    padding: 0.3rem 0;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    overflow: hidden;
    &.isfixed{
      position: fixed;
      /* js 获取 */
      /*top: 44px;*/
      padding: 15px 0.3rem;
    }
    .rec-tab-item{
      float: left;
      font-size: 14px;
      line-height: 20px; 
      margin-right: 0.5rem;
      position: relative;
      &.isactive:after{
        content:'';
        display: block;
        width: 100%;
        height: 0.06rem;
        background: url('../assets/images/icon-like_tab.png') no-repeat;
        background-size: 100%;
        position: absolute;
        bottom: 2px;
        left: 0;
        z-index: -1;
      }
    }
  }
}
.section-head{
  height: 0.9rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .section-title{
    line-height: 0.4rem;
    font-size: 15px;
    text-align: center;
    position: relative;
    &:before,&:after{
      content:'';
      display: block;
      width: 12px;
      height: 1px;
      background: url('../assets/images/icon-rec_title.png') no-repeat;
      background-position: 0 0;
      background-size: auto 100%;
      position: absolute;
      top: 0.18rem;
      left: -0.4rem;
    }
    &:after{
      background-position: -15px 0;
      left: auto;
      right: -0.4rem;
    }
  }
}
.section-border{
  margin-bottom:10px;
  border-bottom: 1px solid #f2f2f2;
  &:last-child{
    margin-bottom:0;
    border-bottom: 0;
  }
}
.after-more{
  padding: 0.3rem;
  text-align: center;
  .more-text{
    display: inline-block;
    line-height: 0.4rem;
    padding: 0 0.2rem;
    color: #666;
    font-size: 12px;
    border: 1px solid #dedede;
    border-radius: 1px;
    .iconfont{
      font-size: 12px;
    }
  }
}
</style>

<style lang="less">
  div.spe-info .tm {
    i{ color: #fff; font-size: 6px;}
    b{
      width: 14px;
      height: 15px;
      line-height: 10px;
      padding-top: 4px;
    }
  }

</style>
