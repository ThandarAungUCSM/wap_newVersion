<template>
	<div ref="package_list">
		<div v-title :data-title="$store.state.order_title" v-if="$store.state.order_title">{{$store.state.order_title}}</div>
		<order-header :text="$store.state.order_title"></order-header>
		<div class="commission">
      <div class="total-commission">
          <div class="statistics">
            <p>分销佣金</p>
            <p><span class="price">0.00</span>元</p>
          </div>
          <div class="btn">
            提现明细
          </div>
      </div>
      <div class="option mg5">
        <div>可提现佣金</div>
        <div>0.00元</div>
      </div>
      <div class="option bor1">
        <div>已提现佣金</div>
        <div>0元</div>
      </div>
      <div class="option">
        <div>待打款佣金</div>
        <div>0元</div>
      </div>

      <div class="btn1">我要提现</div>
    </div>
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
				
			}
		},
		components: {
			orderHeader,
			Shopsn,
			toTop
		},
		mounted() {
			this.$store.state.order_title = '分销佣金';
			let _this = this;
			window.addEventListener('scroll',function(){ 
				if(!_this.$refs.package_list) return;
				if(document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) { 
					//如果第一次请求没数据或数据没达到每页个数就不会再请求数据
					if(_this.roll_switch == false){
						return;
					}
					if(_this.slide_switch == true){
						_this.slide_switch = false;
						_this.page++;
					}
				}
			})
		},
		methods: {
		
		}
	}
</script>
<style lang="less" scoped>
    .commission{
      .total-commission{
        display:flex;
        justify-content: space-between;
        align-items: center;
        padding: .33rem;
        background: #d02629;
        color:#fff;
        .statistics{
            p:nth-child(1){
              margin-bottom:.3rem;  
            }
            .price{
              font-size: .35rem;
            }
        }
        .btn{
          font-size: .25rem;
          padding: .1rem;
          border: 1px solid #fff;
          border-radius: .13rem;
        }
      }
      .option{
        display:flex;
        justify-content: space-between;
        align-items: center;
        padding: .23rem;
        background: #fff;
        color:#353535;
        div{
          font-size: .3rem;
        }
        >div:nth-child(2){
          color: #666666;
        }
      }
      .mg5{
        margin-bottom: .15rem;
      }
      .bor1{
        border-bottom: 1px solid #e3e3e3;
      }
      .btn1{
        width: 94%;
        margin: .4rem auto;
        text-align: center;
        background: #ff0000;
        height: .9rem;
        line-height: .9rem;
        color:#fff;
        border-radius: .1rem;
        font-size: .3rem;
        letter-spacing: .05rem;
      }
    }
</style>