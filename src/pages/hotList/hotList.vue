<template>
  <div class="outer">
    <top-header :title='title' class='head i'></top-header>
    <div class="box">
      <div 
      class="page"
      :style='`background-color:${bgc}`'>
        <div class="special-banner"><img :src="banUrl" alt=""></div>
        <ul class="rec-section">  
          <li 
            v-for='(list , idx) in hotList'
            :key='idx'
            class="section-list"
            @click='skipDetail(list.id)'>
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
           >
           <div  v-if="idx<3" class="list-ranking" :class="`list-ranking${idx+1}`"></div>
           <div  v-if="idx>=3" class="other-ranking">TOP.{{idx+1}}</div>
           </action>
          </li>
        </ul>
      </div>
    </div>
  </div>
  
</template>

<script>
import { getHotList } from '@/http/sdk'
import {mdTime} from '@/util'
import topHeader from '@/components/topHeader'
import Action from '@/components/action'
import { addScanRecord } from '@/http/ajax'

export default {
  components: {
    'top-header':topHeader,
    'action':Action,
  },
  data() {
    return {
      title:'',
      banUrl:'',
      bgc:'',
      hotList: []
    }
  },
  methods: {
    skipDetail(id){
      addScanRecord('hot',id)
      this.changeUrl('detail',`&id=${id}`)
    },
    getList(id){
      console.log(id)
      getHotList(id).then((res)=>{
        let rfdsUrl = res.response.rfdsUrl
        this.bgc = '#' + res.response.colour
        this.banUrl = rfdsUrl + res.response.imgUrl
        this.title = res.response.title
        let data = res.response.partList
        let info = data.map(i=>{
          let time_range = mdTime(i.activityStartTime,i.activityEndTime)
          let cr = i.countDownType=='N'?0:i.currentMills
          return {
            id : i.activityId,
            url: rfdsUrl + i.activityPicList,
            title:i.theme,
            area: i.activityArea,
            sign_num: i.requestNumFront,
            time_range,
            price: i.entryFee,
            isEntry:i.entryNumFull,
            status:i.actEntryStatus-0,
            current:cr,
            sdt:i.entryStartTime||'',
            edt:i.entryEndTime||'',
          }
        })
        this.hotList = info
      }).catch(e=>{
        console.log(e)
      })
    },
  },
  mounted(){
    let id = this.$route.query.partId
    this.getList(id)
  }
}
</script>

<style scoped lang="less">
.list-ranking{
     width: 21px;
    height: 33px;
    position: absolute;
    background: red;
    z-index: 999;
    top: 0;
    left: 10px;
    background: url('../../assets/images/icon-hotTop.png') no-repeat;
    background-size: auto 100%;
    &.list-ranking1{ background-position:0 0 ;}
    &.list-ranking2{ background-position:-25px 0 ;}
    &.list-ranking3{ background-position:-50px 0 ;}
}
.other-ranking{
  width: 43px;
  height:20px;
  position: absolute;
  left: 0;
  top:0;
  z-index: 999;
  background: url('../../assets/images/icon-hotList_rank.png') no-repeat 0 0;
  background-size:43px 20px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  font-size: 10px;

}
.outer{
  height: 100%;
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
  color: #fff;
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