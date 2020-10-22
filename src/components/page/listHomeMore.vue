<template>
	<div ref="home_more_list">
		<div v-title data-title="商品列表">商品列表</div>
		<list-header :sea="search" v-on:child-say="submit"></list-header>
		<ul class="sort-wrap clearfix text-center">
			<li class="fl" :class="{active:sortField == 'sales_sum'}" @click="sort('xl')">销量
				<span class="icon">
							<em class="bottom" :class="{active:sort_id == 1}"></em><br>
							<em class="top" :class="{active:sort_id == 2}"></em>
						</span>
			</li>
			<li class="fl" :class="{active:sortField == 'price_member'}" @click="sort('jg')">价格
				<span class="icon">
							<em class="top" :class="{active:sort_id == 3}"></em><br>
							<em class="bottom" :class="{active:sort_id == 4}"></em>
						</span>
			</li>
			<li class="fl" @click="sort('rq')" :class="{active:sortField == 5}">人气</li>
			<li class="fl" @click="sort('new')" :class="{active:sortField == 'id'}">新品</li>
		</ul>
		<ul class="list-wrap">
			<li class="clearfix" v-for="item in search_data" :key="item.id">
				<div class="product-list" @click="tolink(item.id)">
					<img v-lazy="URL + item.pic_url" class="fl">
					<div class="list-text fl">
						<p class="text">{{item.title}}</p>
						<p class="new-price">￥
							<span>{{item.goods_price || item.price_market|| item.price_member}}</span>
						</p>
						<p class="status"><span>已有{{item.comment_member}}条评论</span><span>{{item.sales_sum}}笔交易成功</span></p>
					</div>
				</div>
				<div class="show-shop">
					<div class="show-name" @click="goToShop(item.store_id)">{{item.shop_name}}</div>
					<img @click="goToShop(item.store_id)" src="../../assets/btn-right.png" class="btn-shop" v-if="item.shop_name"/>
					<el-dropdown v-if="item.store_grade_name">
						<span class="shop-gradename">{{item.store_grade_name}}</span>
						<el-dropdown-menu slot="dropdown" v-if="item.classification">
						<el-dropdown-item>{{item.classification}}</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</li>
		</ul>
		<div v-if="search_data.length ==0" class="comm-null">
			<div class="con-wrap text-center">
				<img src="../../assets/null_com.png">
				<p>暂无商品</p>
			</div>
		</div>
		<div class="load" v-show="load" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
	
		<div class="load-wrap" v-show="load_wrap" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
		<to-top></to-top>
	</div>
</template>

<script>
	import listHeader from '@/components/page/children/header.vue';
	import shopList from '@/components/shopCon/child/shoplist.vue'; //店铺列表样式
	import qs from 'qs';
	import {
		Toast
	} from 'mint-ui';
	import Shopsn from '@/components/page/Shopsn.vue';
	import toTop from '@/components/page/toTop.vue';
	export default {
		name: 'list',
		data() {
			return {
				logoImg: require('@/assets/btn-return.png'),
				status: [true, false, false],
				search: true,
				id: null,
				sort_type: 'desc',
				load: false,
				scrollWatch: true,
				load_wrap: true,
				search_data: [],
				msg: '',
				api_url: '',
				num: 0,
				sortField: 'sales_sum',
				sort_id: 1,
				currentPage: 1,
				isBottom: false,
				isEnd: false,
			}
		},
		methods: {
			goToShop(id){
				this.$router.push({
					name:"shopHome",
					params:{
					id:id,
					index:0
					}
				})
			},
			submit(search_data) {
				this.sortField = 'sales_sum';
				this.isBottom = false;
				this.isEnd = true;
				this.sort_id = 1;
				this.currentPage = 1;
				this.search_data = search_data;
			},
			activeClick(index) {
				this.num = index
			},
			toback: function() {
				this.$router.go(-1);
			},
			addClass: function(index) {
				for (var i = 0; i < this.status.length; i++) {
					this.$set(this.status, i, false);
				}
				this.$set(this.status, index, true);
			},
			sort(index) {
				this.isEnd = true;
				switch (index) {
					case 'xl':
						this.currentPage = 1;
						this.search_data = [];
						this.sortField = 'sales_sum';
						if (this.sort_id != 1) {
							this.sort_id = 1;
							this.sort_status = "asc";
						} else {
							this.sort_id = 2;
							this.sort_status = 'desc';
						}
						this.load = true;
						break;
					case 'jg':
						this.currentPage = 1;
						this.search_data = [];
						this.sortField = 'price_member';
						if (this.sort_id != 3) {
							this.sort_id = 3;
							this.sort_type = "asc";
						} else {
							this.sort_id = 4;
							this.sort_type = 'desc';
						}
						this.load = true;
						break;
					case 'rq':
						this.currentPage = 1;
						this.search_data = [];
						this.sortField = 5;
						this.sort_status = '';
						this.load = true;
						break;
					case 'new':
						this.currentPage = 1;
						this.search_data = [];
						this.sort_id = 6;
						this.sortField = 'id';
						this.sort_status = 'desc';
						this.load = true;
						break;
				}
	
				if (this.$store.state.search_value != '') {
					this.api_url = this.$httpConfig.keyWordSearch;
					let value = this.$store.state.search_value;
					this.axios.get(this.api_url, {
						params: {
							keyword: value,
							sort: this.sort_id,
							page: this.currentPage
						}
					}).then((res) => {
						if (res.data.status) {
							if (res.data.msg === '没有找到此商品') {
								this.load_wrap = false;
								this.msg = res.data.msg;
							}
							var list = res.data.data.data;
							for (var i in list) {
								this.search_data.push(list[i]);
							}
							this.isEnd = true;
						} else {
							this.isEnd = false;
						}
						this.isBottom = false;
						this.load = false;
						this.load_wrap = false;
					}).catch((err) => {
						console.info('FailtrueErr', err);
					});
				} else {
					this.axios.post(this.$httpConfig.oneClassGoods, qs.stringify({
						id: this.$route.params.status,
						page: this.currentPage,
						sort_type: this.sort_type,
						sort_field: this.sortField
					})).then((res) => {
						if (res.data.status) {
							var list = res.data.data.records;
							for (var i in list) {
								this.search_data.push(list[i]);
							}
							this.isEnd = true;
						} else {
							this.isEnd = false;
							this.msg = res.data.message;
						}
						this.isBottom = false;
						this.load_wrap = false;
						this.load = false;
					}).catch((err) => {
						console.info('FailtrueErr', err);
					});
				}
	
	
			},
			tolink(id) {
				this.$router.push({
					name: 'product',
					params: {
						id: id,
						status: 1
					}
				});
			},
		},
		created() {
			this.sort();
			this.$store.state.search_value = '';
		},
		mounted() {
			var that = this;
			$(window).scroll(function() {
				if (!that.$refs.home_more_list) return;
				var bot = document.body.clientHeight;
				if (that.isBottom == false && document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) {
					that.isBottom = true;
					if (that.isEnd) {
						that.currentPage++;
						that.sort();
					}
				}
			});
		},
		components: {
			listHeader,
			Shopsn,
			shopList,
			toTop
		}
	}
</script>

<style>
.el-popper[x-placement^=bottom] .popper__arrow {
  border-bottom-color: red !important;
  top: -6px !important;
}
.el-popper .popper__arrow {
  border-width: 6px;
  filter: drop-shadow(0 0.04rem .24rem rgba(0,0,0,.03));   
}
</style>
<style lang="less" scoped>
.el-dropdown{
 margin: .04rem 0 0 0;  
}
.el-dropdown-menu {
    /* width: 230px !important; */
    position: absolute !important;
    margin: .1rem 0 0 0 !important;
    background-color: #FFF;
    border: .02rem solid #de2d35;
    border-radius: .08rem;
    -webkit-box-shadow: 0 0.04rem .24rem 0 rgba(0,0,0,.1);
    box-shadow: 0 0.04rem .24rem 0 rgba(0,0,0,.1);
}
.el-dropdown-menu:hover .row{
    color: #444 !important;
}
.el-dropdown-menu__item {
  line-height: .2rem !important;
  font-size: .24rem !important;
  color:rgb(101, 101, 101) !important;
}
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
    color:rgb(101, 101, 101) !important;
    background-color: #ffffff !important;
  }

.el-popper .popper__arrow {
  border-width: 6px;
  filter: drop-shadow(0 0.04rem .24rem rgba(0,0,0,.03));   
}

.el-popper[x-placement^=bottom] .popper__arrow {
  border-bottom-color: red !important;
  top: -6px !important;
}
.el-popper .popper__arrow, .el-popper .popper__arrow:after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;  
}
</style>

<style lang="less" scoped>
	// tab切换
	.tabbaby {
		background: #fff;
		height: .85rem;
		display: flex;
		justify-content: space-between;
		border-bottom: 1/100rem solid #cbcbcb;
		div {
			font-size: 30/100rem;
			width: 275/100rem;
			height: 100%;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 50/100rem;
		}
		.active {
			border-bottom: 3/100rem solid #d02629;
			color: #d02629;
		}
	}
	
	.comm-null {
		padding-top: .5rem;
		p {
			font-size: .28rem;
			color: #666;
			padding-top: .2rem;
		}
	}
	
	.sort-wrap {
		height: .9rem;
		background: #fff;
		box-sizing: border-box;
		padding: .2rem 0;
		border-bottom: 1px solid #cbcbcb;
		line-height: .5rem;
		li {
			border-right: 1px solid #cbcbcb;
			box-sizing: border-box;
			width: 25%;
			font-size: .26rem;
			color: #666;
			position: relative;
			.icon {
				position: absolute;
				left: 1.6rem;
				top: 0;
				height: 100%;
				.top {
					position: absolute;
					left: 0;
					top: .17rem;
					width: .12rem;
					height: .06rem;
					background: url(../../assets/sort-top.png);
					background-size: 100% 100%;
				}
				.top.active {
					background: url(../../assets/sort-top-active.png);
					background-size: 100% 100%;
				}
				.bottom {
					position: absolute;
					left: 0;
					bottom: .17rem;
					width: .12rem;
					height: .06rem;
					background: url(../../assets/sort-bottom.png);
					background-size: 100% 100%;
				}
				.bottom.active {
					background: url(../../assets/sort-bottom-active.png);
					background-size: 100% 100%;
				}
			}
		}
		li:nth-child(4) {
			border-right: 0;
		}
		li.active {
			color: #d02629;
		}
	}
	
	.list-wrap {
		padding-top: .3rem;
		background: #fff;
		li {
			padding: .13rem;
			// height: 2.2rem;
			border-bottom: 1px solid #cbcbcb;
			.product-list{
				display: flex;
				img {
					width: 2.2rem;
					height: 2.2rem;
				}
				.list-text {
					width: 4.3rem;
					padding-left: .25rem;
					.text {
						font-size: .32rem;
						color: #333;
						line-height: .45rem;
						padding-top: .1rem;
						height: .9rem;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}
					.new-price {
						font-size: .32rem;
						color: #f23030;
						padding-top: .3rem;
						span {
							font-size: .4rem;
							font-weight: bold;
						}
					}
					.status {
						color: #ddd;
						padding: .1rem 0 0 0;
						display: flex;
						justify-content: space-between;
						span {
							font-size: .24rem;
						}
					}
				}
			}
			.show-shop{
				display: flex;
				margin: 0 0 .2rem 2.5rem;
				.show-name{
					font-size: .24rem;
					padding: .07rem .1rem 0 0;
					color: #999999;
				}
				.btn-shop{
					width: .18rem;
					height: .2rem;
					margin: .13rem .2rem 0 0;
				}
				.shop-gradename{
					font-size: .25rem;
					background: #de2d35;
					color: white;
					border-radius: .05rem;
					padding: .05rem .1rem;
					text-align: center;
				}
			}
		}
	}
	
	.status {
		background: #fff;
		text-align: center;
		padding-bottom: .2rem;
		font-size: .3rem;
		color: #333;
	}
</style>

<style lang="less">
	.load {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999999;
	}
	
	.load .mint-spinner-triple-bounce {
		width: 100%;
		text-align: center;
		position: absolute;
		left: 0;
		top: 50%;
	}
</style>