<template>
  <div id="app" :class='{"app_hide":isTitle}'>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      isTitle:false
    }
  },
  methods:{
    getDev(){
      let native = navigator.userAgent
      if(native.indexOf('smkVersion')>-1){
        this.isTitle=true
      }
      // let nod = document.createElement('style'),   
      // str = `
      // .app_offset{padding-top: ${rem}rem} 
      // .app_offset .top-bar{padding-top: ${rem}rem;}
      // ` 
      // nod.type='text/css';
      // nod.innerHTML = str;
      // document.getElementsByTagName('head')[0].appendChild(nod); 
    }
  },
  mounted(){
    this.getDev()
  },
}

</script>

<style>
#app {
	height: 100%;
  max-width: 750px;
  min-width: 320px;
  margin: auto;
  position: relative;
  font-family: PingFangSC-Regular,'Microsoft YaHei','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.app_hide .bar{
  /*判断是否 APP */
  display: none;
}
.app_hide .box{
  /*判断是否首页及 user 页面*/
  padding-top: 0!important;
}
</style>
