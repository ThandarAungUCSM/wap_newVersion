<template>
	<div ref="order_list">
		<div v-title :data-title="分销订单">分销订单</div>
		<order-header :text="$store.state.order_title"></order-header>
		<!--<div class="teacher-main">
			<header class="header">
				<span @click="goBack" class="btnGo"></span>
				全部订单
			</header>
		</div>-->
		<div class="nav-wrap">
			<ul class="nav">
				<li class="fl" v-for="(name,index) in datas.name" :key="name.id" :class="{active:isactive == index}" @click="addClass(index,'click')"><span>{{name}}</span></li>
			</ul>
		</div>
		<div class="order-wrap">
			<div class="order-list" v-for="(item,index) in order" :key="item.id">
				<div class="hd clearfix">
					<span class="title fl">{{item.shop_name}}</span>
					<span class="status fr">{{order_status[Number(item.order_status)+1]}}</span>
				</div>
				<div class="describe clearfix" v-for="text in item.goods" :key="text.id">
					<img :src="URL + text.pic_url" class="fl">
					<div class="fl words">
						<p class="text">{{text.title}}</p>
						<!--<p class="clearfix company">
                            <span class="fl" v-if="text.selfAttr[0]">{{text.selfAttr[0].name}}&nbsp;:&nbsp;</span>
                            <span class="fl" v-if="text.selfAttr[0]">{{text.selfAttr[0].item}}</span>
                        </p>-->
					</div>
					<button class="btn" @click="toRouter('/evaluate',item,text)" v-if="item.order_state == 1">马上评论</button>
				</div>
				<div class="commod clearfix">
					<span class="fl total">共{{item.count}}件商品</span>
					<span class="fl actual">实付款&nbsp;:&nbsp;<span>￥{{item.price_sum}}</span></span>
					<span class="icon" v-if="item.order_status == 4 || item.order_status == -1" @click="deletOrder(item,index)"></span>
				</div>
				<div class="operation clearfix">
					<span class="timer fl">下单时间：{{new Date(item.create_time * 1000).getFullYear()+'-'+(new Date(item.create_time * 1000).getMonth()+1)+'-'+new Date(item.create_time * 1000).getDate()+' '+new Date(item.create_time * 1000).getHours()+':'+new Date(item.create_time * 1000).getMinutes()+':'+new Date(item.create_time * 1000).getSeconds()}}</span>
					<!-- <button class="btn fr" @click="toRouter('/pay',item,false)" v-if="item.order_status == 0">马上付款</button>
					<button class="btn fr" @click="toRouter('/order',item,false)" v-if="item.order_status == 1">查看订单</button>
					<button class="btn fr" @click="toRouter('/logis',item,false)" v-if="item.order_status == 3">查看物流</button>
					<button class="butn fr" @click="take(item,false)" v-if="item.order_status == 3">确认收货</button>
					<button class="btn fr repeat" @click="toRouter('/Cart',item,1)" v-if="item.order_status == 4 || item.order_status == -1" v-show="item.order_state != '1'">再次购买</button>
					<button class="btn fr repeat" @click="toRouter('/evaluate',item,1)" v-if="item.comment_status == 0&&item.order_status==4">去评论</button> -->
				</div>
			</div>
			<div class="comm-null" v-if="no_data">
				<div class="con-wrap text-center">
					<img src="../../assets/null_com.png">
					<p>暂时没有订单</p>
				</div>
			</div>
		</div>
		<div class="up-warp" v-show="load_show">
			<p class="rotate"></p>
			<p class="load-title">加载中..</p>
		</div>
		<div class="no-data" v-show="sliding_no_data">暂无更多数据~</div>
		<Shopsn></Shopsn>
		<to-top></to-top>
		<!--<div class="load" v-show="$store.state.order_load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>-->
		<!--<div class="load-wrap" v-show="$store.state.order_load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>-->
	</div>
</template>
<script>
	import orderHeader from '@/components/page/children/header.vue';
	import { MessageBox, Toast } from 'mint-ui';
	import Shopsn from '@/components/page/Shopsn.vue';
	import toTop from '@/components/page/toTop.vue';
	import qs from 'qs';
	export default {
		name: 'orderNav',
		data() {
			return {
				datas: {
					name: ['全部', '待付款', '待发货', '待收货', '已完成', '已取消', '待评论']
				},
				search: true,
				isactive: '',
				slide_switch: false, //避免多次下拉
				load_show:true, //滚动动画
				roll_switch:true, //触发下拉加载开关
				no_data:false, //第一次没数据时的样式
				sliding_no_data:false, //下拉没数据时的样式
				page:1,
				sw:true,
				order: [],
				order_status:['取消订单','未支付','已支付','发货中','已发货','已收货','退货审核中','审核失败','审核成功','退款中','退款成功']
			}
		},
		components: {
			orderHeader,
			Shopsn,
			toTop
		},
		mounted() {
			this.$store.state.order_title = '分销订单';
			this.addClass(this.$route.params.id,'roll');
			let _this = this;
			window.addEventListener('scroll',function(){ 
				if(!_this.$refs.order_list) return;
				if(document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) { 
					//如果第一次请求没数据或数据没达到每页个数就不会再请求数据
					if(_this.roll_switch == false){
						return;
					}
					if(_this.slide_switch == true){
						_this.slide_switch = false;
						_this.page++;
						_this.addClass(_this.isactive,'roll');
					}
				}
			})
		},
		methods: {
			// 确认收货
			take(item){
					MessageBox.confirm('确定收货?').then(action => {
						this.axios.post(this.$httpConfig.confirmGet,qs.stringify({
							id:item.id
						})).then((res)=>{
							console.log(res);
							Toast(`${res.data.message}`);
							if(res.data.data==true){
								this.addClass(3,'click');
							}
						}).catch((e)=>{
							console.log(e)
						})
					}).catch((err)=>{
						console.log(err);
					})
				
			},
			//请求成功后的操作
            returnOperation(data){
				if(data.length < 10 && this.page == 1){ //第一次请求成功如果数据没达到每页页数就禁止下拉
					this.load_show = false; //动画隐藏
					this.roll_switch = false; //禁止下拉加载
				}
				for (let index = 0; index < data.length; index++) {
                    this.order.push(data[index]);
				}
				this.slide_switch = true;
			},
			//请求后返回不同状态时的处理
			stateHandling(status,data){
				this.sw = true;
				if(status == 10001) {
					this.$router.push('/LogIn');
				}else if(status == 1){ //成功后的处理
					this.returnOperation(data);
				}else if(status == 0 && this.page == 1) { //第一次请求失败时
					this.no_data = true; //无数据时的样式
					this.load_show = false; //动画隐藏
					this.roll_switch = false; //禁止下拉加载
				}else{ //第二次或更多次无数据时
					this.sliding_no_data = true; //无数据时的样式
					this.load_show = false; //动画隐藏
					this.roll_switch = false; //禁止下拉加载
				}
			},
			goBack() {
				this.$router.push({
					name: '/distribution'
				})
			},
			deletOrder(item,index){
				MessageBox.confirm('确定删除订单?').then(action => {
					this.axios.post(this.$httpConfig.orderDel, qs.stringify({
						id:item.id
					})).then((res) => {
						this.order.splice(index,1);
						Toast('成功删除订单！');
					}).catch((err) => {
						console.log(err);
					});
				}).catch((err) => {
					console.log(err);
				});
			},
			addClass(index,trigger) {
				if(trigger == 'click'){
					this.order = [];
					this.load_show = true
					this.page = 1;	
					this.no_data = false;	
					this.sliding_no_data = false;	
					}
					if(this.sw == true){
						this.sw = false;
					}else{
						return;
					}
				this.roll_switch = true;
				this.isactive = index;
				if(index == 0) {
					this.$store.state.order_title = '分销全部订单'; +
					this.axios.post(this.$httpConfig.orderListAll, qs.stringify({
						page:this.page
					})).then((res) => {
						this.stateHandling(res.data.status,res.data.data.list);
					}).catch((err) => {
						console.log(err);
					});
				} else if(index == 1) {
					this.$store.state.order_title = '分销待付款订单';
					this.axios.post(this.$httpConfig.pendingPayment,qs.stringify({
						page:this.page
					})).then((res) => {
						this.stateHandling(res.data.status,res.data.data.list);
					}).catch((err) => {
						console.log(err);
					});
				} else if(index == 2) {
					this.$store.state.order_title = '分销待发货订单';
					this.axios.post(this.$httpConfig.pendingDelivery,qs.stringify({
						page:this.page
					})).then((res) => {
						this.stateHandling(res.data.status,res.data.data.list);
					}).catch((err) => {
						console.log(err);
					});
				} else if(index == 3) {
					this.$store.state.order_title = '分销待收货订单';
					this.axios.post(this.$httpConfig.goodsToBeReceived,qs.stringify({
						page:this.page
					})).then((res) => {
						this.stateHandling(res.data.status,res.data.data.list);
					}).catch((err) => {
						console.log(err);
					});
				} else if(index == 4) {
					this.$store.state.order_title = '分销已完成订单';
					this.axios.post(this.$httpConfig.completed,qs.stringify({
						page:this.page
					})).then((res) => {
						this.stateHandling(res.data.status,res.data.data.list);
					}).catch((err) => {
						console.log(err);
					});
				} else if(index == 5) {
					this.$store.state.order_title = '分销已取消订单';
					this.axios.post(this.$httpConfig.haveBeenCancelled,qs.stringify({
						page:this.page
					})).then((res) => {
						this.stateHandling(res.data.status,res.data.data.list);
					}).catch((err) => {
						console.log(err);
					});
				} else if(index == 6) {
					this.$store.state.order_title = '分销待评论订单';
					this.axios.post(this.$httpConfig.toBeEvaluated,qs.stringify({
						page:this.page
					})).then((res) => {
						this.stateHandling(res.data.status,res.data.data.list);
					}).catch((err) => {
						console.log(err);
					});
				}
			},
			toDetails(item, text, index) {
				this.$router.push({
					name: 'orderDetails',
					params: {
						status: item.order_status,
						order: item.id,
						order_type: 2, //1为积分订单 2 为商品订单
						order_status:item.order_status
					}
				});
			},
			toRouter(to, item, text) {
				switch(to) {
					case '/evaluate':
						this.$store.state.order_ommodity = text;
						this.$router.push({
							name: 'evaluate',
							params: {
								id: item.id
							}
						});
						break;
					case '/Cart':
						this.$router.push({
							name: 'orderDetails',
							params: {
								status: 4,
								order: item.id,
								order_type: 2 //1为积分订单 2 为商品订单
							}
						})
						break;
					case '/logis':
						this.$router.push({
							name: 'logis',
							params: {
								status: 3,
								id: item.id,
								order_type: 2 ,//1为积分订单 2 为商品订单
								order_status:item.order_status
							}
						});
						break;
					case '/order':
						this.$router.push({
							name: 'orderDetails',
							params: {
								status: 2,
								order: item.id,
								order_type: 2 //1为积分订单 2 为商品订单
							}
						});
						break;
					case '/pay':
						this.$router.push({
							name: 'orderDetails',
							params: {
								status: item.order_status,
								order: item.id,
								order_type: 2 //1为积分订单 2 为商品订单
							}
						});
						break;
					case '/evaluate':
						this.$router.push({
							name: 'evaluate',
							params: {
								id: item.id
							}
						});
				}
			},

		}
	}
</script>
<style lang="less" scoped>
	.teacher-main {
		.header {
			width: 100%;
			height: .62rem;
			background: #d02629;
			padding: .16rem 0;
			text-align: center;
			position: relative;
			color: #fff;
			font-size: .36rem;
			font-weight: bold;
			line-height: .62rem;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 1;
			.btnGo {
				position: absolute;
				left: .2rem;
				top: 50%;
				margin-top: -0.23rem;
				width: .46rem;
				height: .46rem;
				background: url('../../assets/btn-return.png') no-repeat;
				background-size: 100% 100%;
			}
		}
	}
	
	.nav-wrap {
		width: 100%;
		overflow-x: auto;
		background: #fff;
		.nav {
			width: 12.39rem;
			height: .94rem;
			border-bottom: 1px solid #dfdfdd;
			li {
				width: 1.77rem;
				height: 100%;
				text-align: center;
				overflow: hidden;
				box-sizing: border-box;
				span {
					display: block;
					color: #676767;
					font-size: .3rem;
					line-height: .54rem;
					height: .54rem;
					margin: .2rem 0;
					border-right: 1px solid #dfdfdd;
				}
			}
			li:last-child span {
				border-right: 0;
			}
			li.active {
				border-bottom: 3px solid #fd4f4b;
				span {
					color: #ff781a;
				}
			}
		}
	}
	
	.whole-wrap {
		background: #f1f1f1;
	}
	
	.order-wrap {
		padding-top: .1rem;
		.comm-null {
			padding-top: .5rem;
			p {
				font-size: .28rem;
				color: #666;
				padding-top: .2rem;
			}
		}
	}
	.up-warp{
        height:.5rem;
		padding: .3rem 0;
		text-align: center;
		p{
			display: inline-block;
			vertical-align: middle;
		}
		.rotate{
			width: 16px;
			height: 16px;
			border-radius: 50%;
			border: 1px solid gray;
			margin-right: 6px;
			border-bottom-color: transparent;
		}
		.rotate{
			-webkit-animation:rotate .6s linear infinite;
			animation:rotate .6s linear infinite
		}
		@-webkit-keyframes rotate{
			0%{
				-webkit-transform:rotate(0deg)
				}
			100%{
				-webkit-transform:rotate(360deg)
				}
			}
		@keyframes rotate{
			0%{
				transform:rotate(0deg)
			}
			100%{
				transform:rotate(360deg)
			}
		}
		.load-title{
			font-size: 12px;
    		color: gray;
		}
	}
	.no-data{
        background-color:#fff;
        height: .5rem;
        padding: .3rem 0;
        text-align: center;
        font-size: 12px;
        color: gray;
    }
	.order-list {
		background: #fff;
		line-height: .7rem;
		margin-bottom: .2rem;
		.hd {
			margin: 0 .2rem;
			border-bottom: 1px solid #dfdfdd;
			height: .7rem;
			.title {
				font-size: .29rem;
				color: #d02629;
			}
			.status {
				font-size: .3rem;
				color: #f9781e;
			}
			.status.light {
				color: #adadad;
			}
			.status.ash {
				color: #333;
			}
		}
		.describe {
			margin: 0 .2rem;
			height: 1.46rem;
			padding: .13rem 0;
			border-bottom: 1px solid #dfdfdd;
			position: relative;
			.company {
				padding-top: .2rem;
				padding-left: .2rem;
				span {
					font-size: .22rem;
					color: #999;
				}
			}
			.btn {
				position: absolute;
				right: 0;
				bottom: .1rem;
				width: 1.5rem;
				height: .5rem;
				border: 1px solid #ff881e;
				background: #fff;
				border-radius: 20px;
				color: #ff881e;
			}
			img {
				width: 1.46rem;
				height: 1.46rem;
			}
			.words {
				width: 5.24rem;
				.text {
					padding: 0 .2rem;
					font-size: .32rem;
					color: #333;
					line-height: .45rem;
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
		}
		.commod {
			padding: 0 .2rem;
			height: .9rem;
			line-height: .9rem;
			border-bottom: 1px solid #dfdfdd;
			position: relative;
			span {
				font-size: .3rem;
				color: #333;
			}
			.actual {
				padding-left: .7rem;
				span {
					color: #ff881e;
				}
			}
			.icon {
				position: absolute;
				right: .35rem;
				top: 50%;
				width: .38rem;
				height: .47rem;
				background: url(../../assets/trash.png) no-repeat;
				background-size: 100% 100%;
				margin-top: -.235rem;
			}
		}
		.operation {
			height: .7rem;
			padding: .1rem .2rem;
			line-height: .7rem;
			.timer {
				font-size: .25rem;
				color: #757575;
			}
			.butn{
				width: 1.5rem;
				height: .7rem;
				margin-right:0.1rem; 
				background: #fff;
				border: 1px solid #f9781e;
				font-size: .27rem;
				color: #f9781e;
				border-radius: 5px;
				outline: none;
			}
			.btn {
				width: 1.5rem;
				height: .7rem;
				background: #fff;
				border: 1px solid #f9781e;
				font-size: .27rem;
				color: #f9781e;
				border-radius: 5px;
				outline: none;
			}
			.repeat {
				width: 1.3rem;
				height: .7rem;
				background: #fff;
				border: 1px solid #f9781e;
				font-size: .27rem;
				color: #f9781e;
				margin: 0 0.1rem;
				border-radius: 5px;
				outline: none;
			}
		}
	}
</style>