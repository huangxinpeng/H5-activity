<template>
  <div>
    <div class="section-list">
      <slot></slot>  
      <div class="section-img">
        <img :src="src">
        <div class="mask" v-if='signLimit=="Y"&&status!=2'><i class="sign-limit-icon"></i></div>
      </div>
      <div class="section-info">
        <h4>{{title}}</h4>
        <div class="section-des">
          <p><i class="iconfont icon-dizhi"></i>{{area}} <span class="sign-num">{{sign_num}}人报名</span></p>
          <p><i class="iconfont icon-shijian"></i>{{time_range}}</p>
          <p class="section-price">&yen;{{fomPrice[0]}} <i v-if="fomPrice.length>1">起</i></p>
          <div class="sign-status">
            <template v-if='distance===0'>
              <p class="pimg" v-if="status===0"><img src="../assets/images/btn_bmwks.png" class="imgs"  alt=""></p>
              <p class="pimg" v-if="status===1"><img src="../assets/images/btn_bmz.png" class="imgs imgsbmz" alt=""></p>
              <p class="pimg" v-if="status===2"><img src="../assets/images/btn_bmyjs.png" class="imgs" alt=""></p>
              <!-- <p v-if='status===0' class="sign-button plain">报名未开始</p>
              <p v-if='status===1' class="sign-button">报名中</p>
              <p v-if='status===2' class="sign-button disabled">报名已结束</p> -->
            </template>
            <div v-if='distance!=0'>
              <p v-if='distance===-1'>距离报名开始</p>
              <p v-if='distance===1'>距离报名结束</p>
              <p class="small">
                <time-count 
                  :c='c'
                  :s='s'
                  :e='e'/>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mdFormat } from '../util'
import timeCount from './timeCount'
export default {
  props:{
    status:{
      type:Number,
      default:1
      //0:报名未开始 1:报名中 2:报名结束
    },
    signLimit:{
      type:String,
      default:'N'
      // Y:名额已满 N:名额未满
    },
    src:{
      type:String
    },
    title:{
      type:String
    },
    area:{
      type:String
    },
    sign_num:{
      type:[String,Number]
    },
    time_range:{
      type:String
    },
    price:{
      type:[String,Number]
    },
    c:{
      type:[String,Number]
    },
    s:{
      type:[String,Number]
    },
    e:{
      type:[String,Number]
    },
  },
  components:{
    'time-count':timeCount
  },
  computed:{
    fomPrice(){
      let arr = this.price.split('-')
      let res = arr.map(i=>{
        return i.replace('.0','')
      })
      return res
    },
  },
  data(){
    return {
      ms:0,
      distance:0,   // 0, -1:start, 1:end
    }
  },
  mounted(){
    let c = this.c,
      s = mdFormat(this.s).millis,
      e = mdFormat(this.e).millis
    // console.log(c,s,e)
    if(!(c&&s&&e)) return this.distance = 0;
    let dis = c-s<=0?-1:
      c-e<=0?1:0        //计时相对标示
    this.distance = dis
    // console.log(this.distance)
  }
}
</script>

<style scoped lang="less">
.section-list{
  width: 100%;
  padding-bottom: 8px;
  padding-left: 115px;
  position: relative;
  .section-img{
    width: 105px;
    height: 105px;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 2px;
    overflow: hidden;
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
.mask{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width:100%;
  height: 100%;
  .sign-limit-icon{
    width: 55px;
    height: 55px;
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: url('../assets/images/icon-act_meym.png');
    background-size: 100%;
  }
}

.section-info{
  position: relative;
  /*float: right;*/
  width: 100%;
  padding-right: 10px;
  h4{
    font-size: 15px;
    line-height: 20px;
    height: 40px;
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
    overflow: hidden;
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
.sign-status{
  position: absolute;
  bottom: 0px;
  right: 1px;
  font-size: 10px;
  text-align: right;
  .small{
    line-height: 10px;
    margin-top: 4px;
    b{
      width: 12px;
      height: 13px;
      line-height: 13px;
      font-size: 8px;
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
      font-size: 6px;
      color: #333;
    }
  }
  .count-dis .small{ color: #999; }
  .count-dis .small b{ border-color: #999; }
  .pimg{
    height: 25px;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 9
  }
  .imgs{
    width: 80px;
    height: 25px;
  }
  .imgsbmz{
    width: 61px;
  }
}
</style>
