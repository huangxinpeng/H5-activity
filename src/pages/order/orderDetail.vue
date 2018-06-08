<template>
    <div class="order-detail">
        <div class="page">
            <div class="order">
                <div class="left">
                    <img src="http://activity.96225.com/group1/M00/01/31/rBACJ1qQ16aAfW2YAACECZnu5As352.png" width="110" height="110" alt="">
                </div>
                <div class="right">
                    <p class="tit">杭州市民卡，0元体验纯美英语外教</p>
                    <p class="content">在线课程，在家即可体验！</p>
                    <p class="time">2018-07-02 12:01——2019-01-01 10:39</p>
                    <p class="money">￥0</p>
                    <p class="state">已取消</p>
                </div>
            </div>
            <ul class="order-list">
                <li>
                    <div class="list-left">·订单号</div>
                    <div class="list-right">9000001201852121214768555058</div>
                </li>
                <li>
                    <div class="list-left">·手机号</div>
                    <div class="list-right">18503050260</div>
                </li>
                <li>
                    <div class="list-left">·活动时间</div>
                    <div class="list-right">2018-05-02 10:30-18:30 2018-05-33 15:30-18:30</div>
                </li>
                <li>
                    <div class="list-left">·订单状态</div>
                    <div class="list-right">报名成功</div>
                </li>
            </ul>
            <mt-switch v-model="value">{{value}}</mt-switch>
            <mt-switch v-model="option">{{option}}</mt-switch>
        </div>
    </div>
</template>

<script>
import { Switch } from 'mint-ui';
export default {
    components:{
        [Switch.name]:Switch
    },
    name: 'name',
    data: function() {	
        return {
            value:'',
            option:''
        }
    },
    watch:{
      value:function(newData,oldData){
          console.log(newData+'1')
          console.log(oldData+'2')
      },
    //   option:function(newData,oldData){
    //       this.value=!this.value
    //   }  
    },
    methods: {}
}
</script>

<style scoped lang="less">
.page{
    padding: 0.15rem;
    background: #fff;
    .order{
        height: 110px;
        .left{
            width: 110px;
            height: 110px;
            position: relative;
            float: left;
        }
        .right{
            margin-left: 125px;
            position: relative;
            // float: left;
            height: 110px;
        }
    }
    .tit{
        margin-right: 70px;
        margin-bottom: 5px;
        overflow: hidden;
        font-size: 15px;
        color: #333;
        font-weight: bold;
        line-height: 19px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .content{
        font-size: 12px;
        margin-bottom: 0;
        line-height: 16px;
        margin-bottom: 2px;
        font-size: 14px;
        color: rgb(136,136,136);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .time{
        color: rgb(136,136,136);
        font-size: 14px;
        line-height: 15px;
    }
    .money{
        position: absolute;
        right: 0;
        top: 0;
        color: rgb(255,84,0);
        font-size: 12px;
        font-weight: bold;
        line-height: 15px;
    }
    .state{
        color:rgb(255,84,0);
        position: absolute;
        bottom: 0;
        left: 0
    }
    .order-list{
        margin-top: 15px;
        padding-top: 15px;
        background: #fff;
        li{
            font-size: 13px;
            line-height: 22px;
            display: flex;
            .list-left{
                flex:2;
               }
            .list-right{
               flex:3;
               text-align: left;
               
            }
        }
        
    }
}
</style>