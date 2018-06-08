<template>
  <div class="inner">
    <top-header :title='"全部"'></top-header>
    <!-- <div class="foot" @click='back'><i class="iconfont icon-guanbi"></i></div> -->
    <div class="block">
      <div class="cell" v-for='i in list' :key='i.rank' @click='tapCell(i.actTypeCode)'>
        <p class="icon"><img :src="i.url" alt=""></p>
        <p>{{i.actTypeName}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import topHeader from '@/components/topHeader'
import { getActivityType } from '@/http/sdk'
export default {
  components:{
    'top-header':topHeader
  },
  data () {
    return {
      list: []
    }
  },
  methods:{
     getUrlParam(name) {
       //截取URL参数
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
    back(){
      this.$router.back()
    },
    tapCell(id){
      this.$router.push({name:'CategoryList',query:{code:id}})
      console.log(id)
    }
  },
  mounted(){
    getActivityType('Y').then((res)=>{
      let data = res.response.typeList
      this.list = data.map(i=>{
        return {
          actTypeCode : i.actTypeCode,
          actTypeName : i.actTypeName,
          url : i.rfdsUrl + i.icoUrl,
          rank : i.rank
        }
      })
    }).catch(e=>{
      console.log(e)
    })
    if(this.getUrlParam('mobile')){
       localStorage.setItem('userId',  this.getUrlParam('userId'))
       localStorage.setItem('mobile',  this.getUrlParam('mobile'))
       localStorage.setItem('userName',this.getUrlParam('name'))
    }
  }
}
</script>

<style scoped lang="less">
.inner{
  position: relative;
  height: 100%;
}
.foot{
  width: 100%;
  height: 1rem;
  background-color: #f9f9f9;
  text-align: center;
  line-height: 1rem;
  position: absolute;
  bottom: 0;
  left:0;
  right: 0;
  .iconfont{
    font-size: 18px;
    color: #999;
  }
}
.block{
  padding: 0.6rem 0;
  overflow: hidden;
}
.cell{
  width: 25%;
  float: left;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  padding: 0.28rem 0;
}
.icon{
  width: 41px;
  height: 41px;
  margin: auto;
  margin-bottom: 0.1rem;
  img{
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
