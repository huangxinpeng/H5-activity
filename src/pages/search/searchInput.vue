<template>
  <div class="block">
    <div class="top-bar-s">
     <div class="top-gt">
      <div class="input-box">
        <p class="search-icon"><i class="iconfont icon-sousuo"></i></p>
        <div class="search-text">
          <form action="javascript:return true;">
          <input
            class='input' 
            type='search' 
            v-model='name' 
            :placeholder='placeholder'
            @input='searchInput' 
            @keyup.enter='searchEnter'>
            </form>
        </div>
        <p class="search-clear" :hidden="!name" @click='clearInput'><i class="iconfont icon-qingchu"></i></p>
      </div>
     </div>
     <p class="gt-text" @click='goBack'>取消</p>
    </div>
    <div class="box">
      <div class="inner">
        <!-- input -->
        <div 
          class="res" 
          v-if='!resultDetail && contentList.length!==0'
          infinite-scroll-disabled="loading"
          v-infinite-scroll="loadMore"
          infinite-scroll-distance="10">
          <div 
          class="res-list" 
          v-for='item in contentList'
          @click='skipDetail(item.activityId)'>
            <p class="lt-icon"><i class="iconfont icon-sousuo"></i></p>
            <p class="content">{{item.content}}</p>
          </div>
          <p class="page-loading" :hidden='loading'>{{loadTip}}</p>
        </div>
        <!-- enter -->
        <div 
          class="res"  
          v-if='resultDetail && actList.length!==0'
          infinite-scroll-disabled="loadingDetail"
          v-infinite-scroll="loadMoreDetail"
          infinite-scroll-distance="10">
          <div 
          class="border" 
          v-for='(list,idx) in actList'
          @click='skipDetail(list.id)'
          :key='idx'>
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
              :e='list.edt'/>
          </div>
          <p class="page-loading" :hidden='loadingDetail'>{{loadTip}}</p>
        </div>
        <!-- none -->
        <div class="no-content" v-if='isNone'>
          <div class="no-img"><img src="../../assets/images/user-blank.png" alt=""></div>
          <p>暂无结果,请重新搜索</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { InfiniteScroll,Toast } from 'mint-ui';
import Action from '../../components/action';
import { getSearchList, getActivityList } from '@/http/sdk';
import { addScanRecord } from '@/http/ajax'
import { mdTime } from '@/util'
export default {
  components:{
    [InfiniteScroll.name]:InfiniteScroll,
    [Toast.name]:Toast,
    'action':Action
  },
  data () {
    return {
      name: '',
      placeholder:'',
      resultDetail:false,     // 是否展示活动列表页
      loadTip:'加载中...',
      loading:false,
      loadingDetail:false,
      page:1,
      pagesizeInput:20,
      pagesize:10,
      totalPages:1,
      contentList:[],
      actList:[]
    }
  },
  computed:{
    isNone(){
      let c = this.contentList.length===0 && this.name
      let a = this.actList.length===0 && this.resultDetail
      return c||a
    }
  },
  methods:{
    goBack(){
      this.$router.back()
    },
    skipDetail(id){
      document.activeElement.blur();
      addScanRecord('search',id)
      this.changeUrl('detail',`&id=${id}`)
    },
    clearInput(){
      this.name=''
      this.resultDetail = false
      this.loadTip = '加载中...'
    },
    searchInput(){
      this.resultDetail = false
      this.loadTip = '加载中...'
      this.actList = []
      this.page =1
      if( !this.name) return this.contentList=[]
      this.getsearchContent(this.page)
    },
    searchEnter(){
      // enter
      this.resultDetail = true
      this.loadTip = '加载中...'
      this.page =1
      this.getsearch(this.page)
    },
    loadMore(){
      this.loading = true;
      if(this.page<=this.totalPages){
        this.getsearchContent(this.page)
      }else{
        this.loadTip = '没有更多活动了'
      }
    },
    loadMoreDetail(){
      this.loadingDetail = true;
      if(this.page<=this.totalPages){
        this.getsearch(this.page)
      }else{
        this.loadTip = '没有更多活动了'
      }
    },
    getsearchContent(p){
      let c = this.name
      if(!c) return
      getSearchList({
        p:p,
        s:this.pagesizeInput,
        c,
      }).then((res)=>{
        let data = res.response
        console.log(data)
        this.totalPages = data.totalPages
        let content = []
        if(data.themeList){
          content = data.themeList.map(i=>{
            return {
              activityId:i.activityId,
              content:i.theme,
            }
          })
        }
        if(p==1) {
          this.contentList = []
          this.contentList = content
        }else{
          this.contentList = this.contentList.concat(content)
        }
        this.page = p+1
        this.loading = false;
      }).catch(e=>{
        console.log(e)
        this.loading = false;
      })
    },
    getsearch(p){
      let c = this.name?this.name:this.placeholder
      getActivityList({
        page:p,
        pageSize:this.pagesize,
        theme:c,
      }).then((res)=>{
        let data = res.response
        console.log(data)
        this.totalPages = data.totalPages
        let content = []
        if(data.activityList){
          content = data.activityList.map(i=>{
            let time_range = mdTime(i.activityStartTime,i.activityEndTime)
            let cr = i.countDownType=='N'?0:i.currentMills
            return {
              id : i.id,
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
        }
        if(p==1) {
          this.actList = []
          this.actList = content
        }else{
          this.actList = this.actList.concat(content)
        }
        this.page = p+1
        this.loading = false;
      }).catch(e=>{
        this.loading = false;
        console.log(e)
        Toast(e.msg)
      })
    },

  },
  mounted(){
    this.placeholder = this.$route.query.searchContent || ''
    // this.searchInput()
  },
}
</script>

<style scoped lang='less'>
.block{
  height: 100%;
  position: relative;
}
.top-bar-s{
  position: absolute;
  top: 0;
  left:0;
  right: 0;
  width: 100%;
  height: 50px;
  font-size: 14px;
  z-index: 99;
  padding: 7.5px 15px;
  padding-right: 60px;
  overflow: hidden;
  background-color: #fff;
  &:after{
    content:'';
    display: block;
    width: 100%;
    height: 1px;
    background-color: #efefef;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
.top-gt{
  width:100%;
  height: 35px;
  line-height: 2px;
}
.gt-text{
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  padding-right: 15px;
  text-align: right;
  line-height: 52px;
}
.input-box{
  width: 100%;
  background-color:#f8f8f8;
  height:100%;
  line-height: 35px;
  position: relative;
  padding: 0 0.6rem 0 0.62rem;
  .search-icon,.search-clear{
    position: absolute;
    top: 0;
  }
  .search-icon{
    left: 0;
    margin-left:10px;
    line-height: 36px;
  }
  .search-clear{
    right:0;
    margin-right: 0.1rem;
    .iconfont{
      color: #999;
      font-size: 20px;
      line-height: 35px;
    }
  }
  .search-text{
    width: 100%;
    height: 100%;
    font-size:16px;
    color: #999;
  }
}
form{
  height: 100%;
}
.input{
  border: 0;
  background-color: transparent;
  height: 100%;
  width: 100%;
  color: #333;
  font-size: 16px;
}
.box{
  height: 100%;
  padding-top: 44px;
  overflow-y: auto;
}
.res{
  padding: 0 0.3rem
}
.res-list{
  border-top: 1px solid #dedede;
  padding: 0.24rem 0 0.24rem 0.6rem;
  font-size: 15px;
  color: #666;
  line-height: 21px;
  position: relative;
  &:first-child{
    border:0;
  }
  .lt-icon{
    position: absolute;
    left: 0;
    right: 0.3rem;
    color: #d4d4d4;
    .iconfont{
      font-size: 14px;
    }
  }
}
.no-content{
  padding: 2rem 0 0;
  text-align: center;
  color: #999;
  font-size: 15px;
  margin: 0.4rem 0;
}
.no-img{
  width: 60%;
  margin: auto;
  img{
    width: 100%;
    height: 100%;
    display: block;
  }
}

.border{
  padding-top: 0.2rem;
  &:not(:last-child){
    border-bottom: 1px solid #dedede;
  }
}
.page-loading{
  text-align: center;
  line-height: 30px;
  padding-bottom: 10px;
  color: #666;
}
</style>
