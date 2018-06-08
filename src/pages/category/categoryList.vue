<template>
  <div class="outer">
    <top-header :title='"分类"' class='head i'></top-header>
    <div class="box">
      <div class="page">
        <div class="tab-list">
          <ul class="tab-list-ul clearfix" ref='ul'>
            <li 
            class="tab-item" 
            v-for='(i,idx) in tabList'
            :class='{"active":tabId==("tab_"+idx)}'
            :ref='`tab_${idx}`'
            @click='tabClick(idx,i.id)'>
              <span class="li">{{i.title}}</span>
            </li>
          </ul>
        </div>
        <div class="view">
          <mt-tab-container v-model="tabId">
            <template v-for='(i,idx) in tabList'>
              <mt-tab-container-item :id="`tab_${idx}`" :key='idx'>
                <div 
                  class="inner-page"
                  v-if='tabId==("tab_"+idx)'
                  v-infinite-scroll="loadMore"
                  infinite-scroll-disabled="loading"
                  infinite-scroll-immediate-check='false'
                  infinite-scroll-distance="10">
                  <div 
                    class="part" 
                    v-for='(i , idx) in actList'
                    @click='skipDetail(i.id)'
                    :key='idx'>
                    <action 
                      :status='i.status'
                      :signLimit='i.isEntry'
                      :src='i.url'
                      :title='i.title'
                      :area='i.area'
                      :sign_num='i.sign_num'
                      :time_range='i.time_range'
                      :price='i.price'
                      :c='i.current'
                      :s='i.sdt'
                      :e='i.edt'
                    ></action>
                  </div>
                  <p class="page-loading" :hidden='!loading'>{{loadTip}}</p>
                </div>
              </mt-tab-container-item>
            </template>
          </mt-tab-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TabContainer, TabContainerItem,InfiniteScroll } from 'mint-ui';
import $ from 'jquery'
import { getActivityType, getActivityList,source } from '@/http/sdk'
import {mdTime} from '@/util'
import topHeader from '@/components/topHeader'
import Action from '@/components/action'
import { addScanRecord } from '@/http/ajax'

export default {
  components:{
    'top-header':topHeader,
    'action':Action,
    [TabContainer.name]:TabContainer,
    [TabContainerItem.name]:TabContainerItem,
    [InfiniteScroll .name]:InfiniteScroll ,
  },
  data () {
    return {
      tabList: [],
      actList: [],
      tabId:'',       // id
      page:1,
      pagesize:10,
      totalPages:1,
      loading:false,
      loadTip:'加载中...',
    }
  },
  methods:{
    skipDetail(id){
      addScanRecord('list',id)
      this.changeUrl('detail',`&id=${id}`)
    },
    loadMore() {
      this.loading = true;
      console.log('bottom ',this.page,this.totalPages)
      if(this.page<=this.totalPages){
        this.getList()
      }else{
        this.loadTip = '没有更多活动了'
        this.loading = false;
      }
    },
    getCate(){
      var r = getActivityType().then((res)=>{
        let data = res.response.typeList
        this.tabList = data.map(i=>{
          return {
            id : i.actTypeCode,
            title : i.actTypeName,
            rank : i.rank
          }
        })
        return new Promise((resolve,rej)=>{
          resolve();
        })
      }).catch(e=>{
        console.log(e)
      })
      return r
    },
    getList(){
      let i = this.tabId.substr(4)
      let id = this.tabList[i].id
      // console.log('getList')
      getActivityList({
        activityType:id,
        page:this.page,
        pageSize:this.pagesize,
      }).then((res)=>{
        let data = res.response
        console.log(data)
        this.totalPages = data.totalPages
        let list = data.activityList.map(i=>{
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
        if(this.page == 1){
          
          this.loading = false;
          setTimeout(()=>{
            this.actList = list
          },0)
          console.log(this.actList)
        }else{
          this.actList = this.actList.concat(list)
          this.loading = false;
        }
        
        this.page = this.page+1
        
      }).catch(e=>{
        console.log(e)
      })
    },
    tabClick(n,id){
      // window.history.pushState(null, null, '#/CategoryList?code=' + id)
      // console.log('tab click')
      // source.cancel(999)
      this.tabId = 'tab_'+n
    },
    scrollX(){
      let ele = this.$refs[this.tabId],       // 当前操作元素
        ul = this.$refs.ul,                   // 父元素
        w_width = $(ul).outerWidth(),         // 父元素宽度
        e_width = $(ele).outerWidth(),        // 元素占位
        scroll_width = $(ul).scrollLeft()     // 卷去宽度
      let _x = $(ele).offset().left           // 元素偏移量

      let offset_left = _x + e_width - w_width + scroll_width

      if( _x > w_width-e_width){
        // 尾部被遮挡
        $(ul).animate({scrollLeft: offset_left}, 200)
      }else if( _x <0){
        // 头部被遮挡
        $(ul).animate({scrollLeft: scroll_width + _x }, 200)
      }
      
    },
  },
  mounted(){
    let code = this.$route.query.code
    this.getCate().then(()=>{
      let n = 0
      this.tabList.forEach((i,j)=>{
        if(i.id == code && j>0) {
          n = j
        }
      })
      this.tabId = 'tab_'+ n
    }).catch(e=>{
      console.log(e,e.msg)
    })
    
  },
  watch:{
    tabId (v){
      this.page = 1
      this.totalPages = 1
      this.actList = []
      
      // console.log('watch')
      this.loadTip = '加载中...'
      this.scrollX()

      this.getList()
    }
  }
}
</script>

<style scoped lang="less">
.outer{
  height: 100%;
}
.head.i{
  position: absolute;
  width: 100%;
}
.box{
  padding: 44px 0 0;
  height: 100%;
}
.page{
  height: 100%;
  padding: 50px 0 0;
  position: relative;
}
.tab-list{
  height: 50px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.tab-list-ul{
  width: 100%;
  display: inline;
  white-space: nowrap;
  float: left;
  overflow-x: scroll; 
  overflow-y: hidden;
}
.tab-item{
  display:inline-block;
  line-height: 50px;
  font-size: 15px;
  padding: 0 10px;
  text-align: center;
  .li{
    position: relative;
  }
}
.active .li:after{
  content: '';
  display: block;
  width: 100%;
  height: 3px;
  background: url('../../assets/images/icon-like_tab.png') no-repeat;
  background-size: 100%;
  position: absolute;
  bottom: 1px;
  left:0;
}
.view{
  height: 100%;
  padding:0 0.3rem;
}

.mint-tab-container{
  height: 100%;
}

.inner-page{
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 99;
  overflow-y: auto;
}
.part{
  padding-top: 8px;
  &:not(:first-child){
    border-top: 1px solid #dedede;
  }
}
.part:not(:first-child){
  border-top: 1px solid #dedede;
}
.page-loading{
  text-align: center;
  line-height: 30px;
  padding-bottom: 10px;
  color: #666;
}

</style>
<style>
.view .mint-tab-container-wrap{
  height: 100%;
  overflow-y:hidden;
}
</style>
