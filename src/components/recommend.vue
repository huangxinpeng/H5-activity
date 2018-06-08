<template>
  <div class="">
    <div class="fix-recommend">
      <h2 class="rec-title">精选活动</h2>
      <div class="holder"
          ref='tab'>
        <ul 
          class="rec-tab" 
          :class='isFixed>0?"isfixed":""'
          :style='`top:${isFixed}px`'>
          <li 
            v-for='( item , i ) in info' 
            class="rec-tab-item" 
            :key='i'
            :class='tabId==i?"isactive":""'
            @click='changeTab(i)'
            >{{item.name}}</li>
        </ul>
      </div>
      <div>
      	<div
          v-for='( item , i ) in info'
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
              @click='skipDetail(list.activityId)'>
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
</template>

<script>
import $ from 'jquery'
import Action from './action';
import {getLikeList} from '@/http/sdk'
import {mdTime} from '@/util'
export default {
  components:{
    'action':Action,
  },
  props:{
    partId:{
      type:[String,Number]
    }
  },
  data () {
    return {
      isFixed:0,
      tabId: 0,
      info:[],
    }
  },
  methods:{
    handleScroll () {
      let scrollTop = $(this.scrollBox).scrollTop()
      let th = this.topBarHeight
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
      }else if(scrollTop >= lh[2]){
        this.tabId = 2
      }
    },
    changeTab(i){
      let offset_top = this.$refs.list[i].offsetTop - this.topBarHeight - 50
      $(this.scrollBox).animate({scrollTop: offset_top}, 200,()=>{
        setTimeout(()=>{this.tabId = i},10)
      })
      
    },
    skipMore(id,name){
      this.$router.push({name:'MoreList',query:{listId:id,listName:name}})
    },
    skipDetail(id){
      console.log(id)
      this.changeUrl('detail',`&id=${id}`)
    },
    getLike(){
      let mobile = localStorage.getItem('mobile')||''
      let pid = this.partId
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
        this.info = info
      }).catch(e=>{
        console.log(e)
      })
    },
  },
  mounted () {
    this.scrollBox = document.getElementById('scrollPage')
    this.topBarHeight = document.getElementById('top_bar').offsetHeight
    this.scrollBox.addEventListener('scroll', this.handleScroll);

    this.getLike()
  },
  destroyed () {
    this.scrollBox.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped lang="less">
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


.section-list{
  width: 100%;
  overflow: hidden;
  padding-bottom: 0.15rem;
  margin-bottom: 0.2rem;
  &:not(:last-child){
    border-bottom: 1px solid #dedede;
  }
  .section-img{
    width: 2.1rem;
    height: 2.1rem;
    float: left;
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
.section-info{
  float: right;
  width: 4.6rem;
  h4{
    font-size: 15px;
    line-height: 20px;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .section-des{
    color: #666;
    font-size: 12px;
    position: relative;
    .iconfont{
      font-size: 10px;
      color: #b1b1b1;
      margin-right: 0.06rem;
    }
    .sign-num{
      float: right;
      font-size: 10px;
    }
    .section-price{
      color: #f45050;
      font-size: 18px;
      i{
        font-size: 15px;
      }
    }
  }
}
.time-count{
  position: absolute;
  bottom: 4px;
  right: 0;
  font-size: 10px;
  text-align: right;
  .small{
    color: #f45050;
    line-height: 10px;
    margin-top: 4px;
    b{
      border: 1px solid #f45050;
      padding: 0 1px;
      border-radius: 1px;
    }
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
