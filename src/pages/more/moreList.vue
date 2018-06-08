<template>
  <div class="outer">
    <top-header :title='title' class='head i'></top-header>
    <div class="box">
      <div 
      class="page"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10">
        <div 
          class="part" 
          v-for='(i , idx) in List'
          :key='idx'
          @click='skipDetail(i.id)'>
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
        <p class="page-loading">{{loadTip}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { InfiniteScroll  } from 'mint-ui';
import { getActivityList } from '@/http/sdk'
import {mdTime} from '@/util'
import topHeader from '@/components/topHeader'
import Action from '@/components/action'
export default {
  components:{
    'top-header':topHeader,
    'action':Action,
    [InfiniteScroll .name]:InfiniteScroll ,
  },
  data () {
    return {
      title:'',
      loadTip:'加载中...',
      List: [
        // {
        //   url:'http://192.168.23.212/group1/M00/00/26/wKgX1FqqFC-AJF7yAAEySlNzvh4066.jpg',
        //   title:'冬季易生病？增强锻炼是关键！快加入冬季健身',
        //   area:'上城区',
        //   sign_num:121,
        //   time_range:'02.09-03.30',
        //   price:9,
        //   time_count:''
        // }
      ],
      loading:false,
      page:1,
      pagesize:10,
      totalPages:1,
      typeId:'',
    }
  },
  methods:{
    skipDetail(id){
      this.changeUrl('detail',`&id=${id}`)
    },
    getList(p){
      return getActivityList({
        activityType:this.typeId,
        page:p,
        pageSize:this.pagesize,
      }).then((res)=>{
        let data = res.response
        this.totalPages = data.totalPages
        let List = data.activityList.map(i=>{
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
        this.page = this.page+1
        this.List = this.List.concat(List)
        return new Promise((res,rej)=>{
          res()
        })
      }).catch(e=>{
        console.log(e)
      })
    },
    loadMore() {
      this.loading = true;
      console.log('bottom ',this.page,this.totalPages)
      if(this.page<=this.totalPages){
        this.getList(this.page).then((res)=>{
          this.loading = false;
        })
      }else{
        this.loadTip = '没有更多活动了'
        this.loading = false;
      }
    },
  },
  mounted(){
    this.typeId = this.$route.query.listId
    this.title = this.$route.query.listName
    // this.getList(1)
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
  padding: 0 0.3rem;
  position: relative;
  overflow-y: auto;
}
.part{
  padding-top: 0.18rem;
  &:not(:first-child){
    border-top: 1px solid #dedede;
  }
}
.page-loading{
  text-align: center;
  line-height: 30px;
  padding-bottom: 10px;
  color: #666;
}
</style>
