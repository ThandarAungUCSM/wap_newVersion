<template>
    <div class="header">
        <router-link to="/home" class="header_logo"></router-link>
        <div class="header_seek" @click="searchIn">
            <img class="header_seek_img" :src="seekImg" alt="搜素img">
            <form action="javascript:void(0);">
                <input type="search" placeholder="搜索宝贝、店铺..." @keyup.enter.stop="submit(value)">
            </form>
        </div>
        <div class="header_news">
            <!-- <router-link to="">
                <img class="header_news_RichScan" :src="RichScan" alt="扫一扫img">
                <div class="header_RichScan" id="myBtn" @click="act">扫一扫</div>
            </router-link> -->
            <router-link to = '/myNews' class="trouble">
                <img class="header_news_advices" :src="advices" alt="消息img">
                <div class="header_RichScan">消息中心</div>
            </router-link>
        </div>
    </div>
</template>
<script>
	import { MessageBox,Toast,Popup } from 'mint-ui';
  import qs from 'qs';
    export default {
        name: 'home-header',
        data() {
            return {
                seekImg:require('@/assets/images/seek.png'),
                RichScan:require('@/assets/images/RichScan.png'),
                advices:require('@/assets/images/advices.png')
            }
        },
        methods: {
            searchIn() {
                this.$router.push({
                    path:'/search'
                })
            },
            act(){
            	Toast({
            		message:'你好啊',
            		position:'top'
            	})
            }
          
        },
        created(){
        },
        mounted(){

        }
      } 	
</script>
<style lang="less" scoped>
    .header{
        width: 7.5rem;
        height: 0.9rem;
        background-color: #d02629;
        position: relative;
        overflow: hidden;
        .header_logo{
            position: absolute;    
            left: 0;
            top: 0;
            width: 1.85rem;
            height: 0.9rem;
            display: block;
            background-image: url("../../../assets/images/logo.png");
            background-size: 100% 100%;
        }
        .header_seek{
            width: 4rem;
            height: 0.6rem;
            background-color: #d02629;
            margin: 0.15rem 0 0 2.1rem;
            border-radius: 0.25rem;
            position: relative;    
        }
         .header_seek input{
                width: 100%;
                height: 0.6rem;
                border-radius: 0.25rem ;
                border: 0.01rem solid #f49494;
                outline: none;
                font-size: 0.26rem;
                text-indent: 0.75rem;
                background-color: #d02629;
                color:#fff;
            }
         .header_seek_img{
             position: absolute;
             top:0.18rem;
             left: 0.25rem;
             display: block;
             width: 0.26rem;
             height: 0.27rem;
         }   
         .header_seek input::-webkit-input-placeholder{
                color: #fff;
         }
         .header_news{
             position: absolute;
             right: 0.1rem;
             top:0.15rem;
             width: auto;
             height: 0.62rem; 
           	
         }
         .header_news a{
             display: block;
             width: 1rem;
             height: 0.62rem;
             float: left; 
             text-decoration: none;
             text-align: center;
             color: #fff;
             font-size: 0.16rem
         }
         .header_news .trouble{
             display: block;
             width: 1rem;
             height: 0.62rem;
             float: left; 
             text-decoration: none;
             text-align: center;
             color: #fff;
             font-size: 0.16rem
         }
         .header_news_RichScan{
             width: 0.32rem;
             height: 0.32rem;
             display: block;
             margin: auto;
             margin-top: 0.07rem
         }
        .header_RichScan{
            width: 100%;
            line-height: 0.3rem;
            /*font-size: .1rem;*/
        }
        .header_news_advices{
             width: 0.38rem;
             height: 0.37rem;
             display: block;
             margin: auto;
             margin-top: 0.02rem
        }
    }
</style>