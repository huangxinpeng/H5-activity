<template>
  <div class="bar" :style='`background-color:${background}`'>
    <div class="content">{{title}}</div>
    <p class="back" @click='back'><i class="iconfont icon-back"></i></p>
  </div>
</template>

<script>
export default {
	props:{
    title:{
      type:String
    },
    background:{
      type:String,
      default:'#fff'
    }
  },
  data () {
    return {}
  },
  methods:{
    back(){
      // this.$router.push({name:'Home'})
      this.$router.back()
    },
  }
}
</script>

<style scoped>
.bar{
  height: 44px;
  padding: 8px 0;
  line-height: 28px;
  position: relative;
}
.bar:after{
  content: '';
  display: block;
  border-top: 1px solid #efefef;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.content{
  padding: 0 50px;
  text-align: center;
  font-size: 18px;
}
.back{
  position: absolute;
  top: 0;
  height: 100%;
  left: 0.1rem;
  z-index: 9;
  padding: 0 0.2rem;
}
.back.close{
  left: 0.9rem;
  padding-left: 0.1rem;
}
.back .iconfont{
  color: #666;
  line-height: 44px;
}
</style>
