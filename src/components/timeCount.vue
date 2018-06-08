<template>
  <span class="tm">
    <b>{{count[0]}}</b><i>天</i><b>{{count[1]}}</b><i>时</i><b>{{count[2]}}</b><i>分</i><b class="s">{{count[3]}}</b><i>秒</i>
  </span>
</template>

<script>
import { mdFormat } from '../util'
export default {
  props:{
    c:{
      type:[Number,String]
    },
    s:{
      type:[Number,String]
    },
    e:{
      type:[Number,String]
    },
  },
  data(){
    return {
      count:[],
    }
  },
  methods:{
    countTime(){
      let c = this.c,
        s = mdFormat(this.s).millis,
        e = mdFormat(this.e).millis
      let status = 0, t = 0
      // console.log(c,s,e)
      // console.log(new Date(c),this.s,this.e)
      if(c-s<=0){
        status = -1
        t = s-c
      }else if(c-e<=0){
        status = 1
        t = e-c
      }else{
        this.$emit('finish')
      }
      this.count = this.format(t)
      let timeout = setInterval(()=>{
        if(t-1000<0) {
          this.$emit('finish')
          t=0
          clearInterval(timeout)
        }else{
          t-=1000
          this.count = this.format(t)  
        }
      },1000)
    },
    format(t){
      let p = t,
        d = 0,
        h = 0,
        m = 0,
        s = 0
      d = parseInt(p/(24*60*60*1000))
      p = p-d*24*60*60*1000
      h = parseInt(p/(60*60*1000))
      p = p-h*60*60*1000
      m = parseInt(p/(60*1000))
      p = p-m*60*1000
      s = parseInt(p/(1000))
      let res = [d,h,m,s]
      return res.map(i=>{
        return ('00'+i).substr(-2)
      })
    },
  },
  mounted(){
    this.countTime()
  }
}
</script>

<style scoped lang="less">

.tm{
  line-height: 10px;
  margin-top: 4px;
  display: inlie-block;
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
    font-size: 8px;
    color: #666;
  }
}


</style>
