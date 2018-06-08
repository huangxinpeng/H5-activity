<template>
  <div class="outer">
    <top-header :title='title' class='head i'></top-header>
    <div class="box">
      <div 
      class="page"
      :style='`background:url(${bgc}) repeat-y`'
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="20">
        <div class="special-banner"><img :src="banUrl" alt=""></div>
        <ul class="rec-section">  
          <li 
            v-for='(list , idx) in seplist'
            :key='idx'
            class="section-list" 
            @click="getDetail(list.activityId)">
           <action
              :status='list.status'
              :signLimit='list.signLimit'
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
          </li>
        </ul> 
        <p class="page-loading">{{loadTip}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { InfiniteScroll ,Toast } from 'mint-ui';
import { getActivityTopicList,addScanRecord } from '@/http/ajax'
import { getActivityType, getActivityList } from '@/http/sdk'
import {mdTime} from '@/util'
import topHeader from '@/components/topHeader'
import Action from '@/components/action'
import URL from '@/http/com.js'
export default {
  components: {
    'top-header':topHeader,
    'action':Action,
    [InfiniteScroll.name]:InfiniteScroll ,
    [Toast.name]:Toast ,
  },
  data() {
    return {
      title:'',
      loading:false,
      banUrl:'',      //URL地址
      bgc:'',         //接口的color
      loadTip:'加载中...',
      totalPages:1,   //总的页数
      topicIdList:{
        page:1,
        pageSize:10,
        topicId:'',
      },
      seplist: []
    }
  },
  methods: {
    loadMore() {
      console.log('bottom ',this.topicIdList.page ,this.totalPages )
      this.loading = true;
      if(this.topicIdList.page<=this.totalPages){
        this.getList(this.topicIdList.page)
      }else{
        this.loadTip = '没有更多活动了'
        this.loading = false;
      }
    },
    getList(p){
      let req = {
        page:p,
        pageSize:this.topicIdList.pageSize,
        topicId:this.topicIdList.topicId,
        // topicId:'asdasdsad',
      }
      getActivityTopicList(req).then((res)=>{
        let _resList = res.response
        let rfdsUrl =_resList.rfdsUrl
        this.title=_resList.topicName
        this.banUrl= rfdsUrl + _resList.imgUrl
        this.totalPages=_resList.totalPages
        this.bgc= rfdsUrl +_resList.bgImgUrl
        var topicArr = _resList.topicList.map((i) => {
           let time_range = mdTime(i.activityStartTime,i.activityEndTime)
           let cr = i.countDownType=='N'?0:i.currentMills
           return {
            url :  rfdsUrl + i.activityPicList,
            title : i.theme,
            area : i.activityArea,
            sign_num : i.requestNumFront,
            time_range,
            price : i.entryFee,
            status : i.actEntryStatus-0,
            signLimit : i.entryNumFull,
            activityId:i.activityId,
            current:cr,
            sdt:i.entryStartTime||'',
            edt:i.entryEndTime||'',
           } 
        });
        if(this.topicIdList.page==1){
          this.seplist=topicArr;
        }else{
          this.seplist = this.seplist.concat(topicArr)
        }
        this.topicIdList.page = this.topicIdList.page+1
        this.loading = false;
      }).catch(e=>{
        Toast(e.msg)
      })
    },
    getDetail(id){
      addScanRecord('topic',id)
      this.changeUrl('detail','&id='+id)
    }
  },
  mounted(){
    this.topicIdList.topicId= this.$route.query.code;
  }
};
</script>

<style scoped lang="less">

.outer{
  height: 100%;
  -webkit-overflow-scrolling: touch;
}
.head.i{
  position: absolute;
  width: 100%;
  background-color: rgba(255,255,255,.5);
}
.box{
  padding: 44px 0 0;
  height: 100%;
}
.page{
  height: 100%;
  position: relative;
  overflow-y: auto;
}
.part{
  padding-top: 0.18rem;
}
.page-loading{
  text-align: center;
  line-height: 30px;
  padding-bottom: 10px;
  color: #999;
}

.special-banner{
  height:2.8rem;
  width:100%;
  position: relative;
  img{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
}
.rec-section {
  padding:0 0.3rem;
  position: relative;
  z-index: 9;
}
.section-list {
  width: 100%;
  overflow: hidden;
  background: #fff;
  border-radius: 2px;
  padding:0.2rem;
  padding-bottom:0;
  margin-bottom: 0.2rem;
  box-shadow: 1px 2px 5px 0px rgba(0,0,0,0.15);
  &:not(:last-child) {
    border-bottom: 1px solid #dedede;
  }
}

</style>
