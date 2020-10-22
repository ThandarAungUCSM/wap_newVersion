<template>
	<div class="product">
		<div v-title data-title="商品详情">商品详情</div>
		<!-- <pr-header :text="title" :productData="productTab" v-on:popupValue="popupData"></pr-header> -->
		<div class="header" :style="headBackgroundColor">
		<!-- <div :style="btnOpacity" @click="goLastPage" class="return"></div>
			<div :style="btnOpacity1" @click="goLastPage" class="return1"></div> -->
		<div :style="tabOpacity" class="tab">
			<div @click="handTab(0)" :class="{active:currentTab == 0}">商品</div>
			<div @click="handTab(1)" :class="{active:currentTab == 1}">详情</div>
			<div @click="handTab(2)" :class="{active:currentTab == 2}">属性</div>
		</div>

		<!-- <div class="btn-ng clearfix" v-if="!btn" v-show="!set" @click="addClass1">
						<span class="fl"></span>
						<span class="fl"></span>
						<span class="fl"></span>
					</div> -->
		<img class="headerimg" src="../../assets/arrow1@2x.png" @click="goLastPage">
		<img src="../../assets/about.png" class="btn-ng clearfix" v-if="!btn" v-show="!set" @click="addClass1">

		<transition  name="fade">
			<div class="box-wrap" v-if="staheader">
			<div class="box-bg" @click="addClass1"></div>
			<div class="bomb-box">
				<div class="polygon"></div>
				<div class="btn" @click="toLink('/home')">
				<span class="icon"><i></i></span>首页
				</div>
				<div class="btn">
				<span class="icon" @click="toLink('/myNews')"><i></i></span>消息
				</div>
				<div class="btn">
				<span class="icon" @click="popupVisible=true"><i></i></span>分享
				</div>
			</div>
			</div>
		</transition>

		<mt-popup v-model="popupVisible" position="bottom" class="pop">
			<div class="share_box">
			<div class="box_header">
				<p class="box_text">分享</p>
			</div>
			<div class="share_logo">
				<div class="up">
                  <img @click="copyLink" src="../../assets/copy.png">
                  <p class="up_text">夏制链接</p>
                  <img @click="qrLink" src="../../assets/QR-code.png">
                  <p class="up_text" style="padding-left:0.19rem">二维码</p>
              </div>
              <div class="dn">  
                  <!-- <div class="account" @click="wxpage0">
                      <img src="../../assets/share_wx_@1.png">
                      <div class="txt">微信好友</div>
                  </div> -->
                  <!-- <div class="account">
                    <div @click="wxpage3" id="button">
                        <img src="../../assets/share_pyq_@1.png">
                        <div class="txt">朋友圈</div>
                    </div>
                  </div>  -->
                  <div class="account" @click="wxpage">
                      <img src="../../assets/share_wx_@1.png">
                      <div class="txt">微信好友</div>
                  </div>
                  <div class="account" @click="initUrl">
                      <img src="../../assets/share_pyq_@1.png">
                      <div class="txt">朋友圈</div>
                  </div>
                  <div class="account" @click="qqpage">
                  <img src="../../assets/share_qq_@1.png">
                  <div class="txt">QQ好友</div>
                  </div>
                  <div class="account" @click="wbpage">
                  <img src="../../assets/share_wb_@1.png">
                  <div class="txt">新浪微博</div>
                  </div>
              </div>
				</div>
			</div>
		</mt-popup>

		<mt-popup v-model="popup" position="bottom" class="pop">
			<div class="copy">
			<div class="copy_header">
				<p class="copy_text">复制</p>
			</div>
			<div class="link">
				<input class="copy_link" type="text" :value="location" id="myInput">
				<button class="copy_button" @click="myFunction">Copy</button>
			</div>
			</div>
		</mt-popup>

		<mt-popup v-model="popupV" position="center" class="qrDiv">
			<div class="qr">
			<div class="qr_header">
				<p class="qr_text">QR扫描</p>
			</div>
			<div class="qr_code">
				<qr-code text="Text to encode" :value="code"></qr-code>
			</div>
			</div>
		</mt-popup>
		</div>
		<PullUpReload
		v-show="tabFlg"
		:on-infinite-load="onInfiniteLoad"
		:parent-pull-up-state="pullUpState"
		>

		<mt-swipe :auto="4000">
			<mt-swipe-item v-for="item in images" :key="item.id">
			<img :src="URL + item.pic_url" />
			</mt-swipe-item>
		</mt-swipe>
		<div class="see-video" v-if="video">
			<img src="../../assets/videoplay.png" class="playimg" @click="showvideo(video)" v-if="video"/>
		</div>
		<div class="describe" v-if="$store.state.commodity_data">
			<div>


			<!-- <div v-if="opt"> -->
			<p class="fn" v-if="detail">{{$store.state.commodity_data.goods.title}}</p>
			<!-- <p class="fn" v-else>{{$store.state.commodity_data.goods.title}}</p> -->
			<p class="fn" v-else>{{productData.title}}</p>
			<!-- </div> -->

			</div>
			<!--      <p class="fn" v-if="!opt">{{$store.state.commodity_data.goods.title}}{{option}}</p>-->
			<!--      <p class="fn" v-if="opt">{{$store.state.commodity_data.goods.title}}</p>-->

			<p class="price" v-if="$store.state.commodity_data.goods.p_id==0">
				<span style="color:red;font-size:20px">
				￥
				{{productData.price_member}}
				</span>
				<span class="new">
				原价 ：￥
				<s>{{productData.price_market}}</s>
				</span>
				<!--        <span class="report" @click="Report">举报</span>-->
				<span class="report" @click="handleNotice">举报</span>
			</p>
			<p class="price" v-else>
				<span style="color:red;font-size:20px">
				￥
				{{$store.state.commodity_data.goods.price_member}}
				</span>
				<span class="new">
				原价 ：￥
				<s>{{$store.state.commodity_data.goods.price_market}}</s>
				</span>
				<!--        <span class="report" @click="Report">举报</span>-->
				<span class="report" @click="handleNotice">举报</span>
			</p>
		</div>
		<!-- <div :class="popupHeader == true ? 'down-tip1' : 'down-tip'">
			<img @click="touchEnd" class="down-tip-img rotate" src="../../assets/totop-1.png">
			</div> -->
		<!--promotion-->
		<!-- <div v-if="detailId == detialSubId">
			<div v-if="promotion.length > 0" @click="showPromotion">
			<div class="promotion">
				<p class="title">促销</p>
				<div class="body" v-for="(item,index) in promotion" :key="index">
					<p class="text" v-if="index==0">
					<span class="name">{{item.name}}</span>
					<span class="full">(满 {{item.full}} 元， 数量 {{item.give_count}} 赠完即止)</span>
					</p>
					<p class="text" v-if="index==1">
					<span class="name">{{item.name}}</span>
					<span class="full">满 {{item.full}} 减 {{item.expression}}</span>
					</p>
				</div>
				</div>
				<span class="btn-right"></span>
			</div>
			<div class="fenge"></div>
			</div>
			<div v-else>
			</div>

			<transition  name="fade">
			<div class="promotion_box" v-if="pro">
				<div class="promotion_main">
				<div class="promotion_header">
					<p class="promotion_text">优惠</p>
					<span class="promotion_cross" @click="showPromotion">×</span>
				</div>
				<div class="box_promotion">
				</div>
				</div>
			</div>
			</transition> -->
		<!-- 已选 -->
		<div class="selected" @click="theSon">
			<span class="title">规格</span>
			<!-- <div v-if="opt">
				<span style="float:right; padding-right: .2rem; font-size: .26rem; margin-top: -.8rem;" v-if="opt" @click="theSon">{{detail}}</span>
				<span style="float:right; padding-right: .2rem; font-size: .26rem; margin-top: -.8rem;" v-else>{{detail}}</span>
			</div> 
			<div v-if="!opt">-->
			<div>
			<span style="float:right; padding-right: .2rem; font-size: .26rem; margin-top: -.8rem;" v-if="detail !== ''">{{detail}}</span>
        	<span style="float:right; padding-right: .2rem; font-size: .26rem; margin-top: -.8rem;" v-else>{{option}}</span>
			</div>



			<span
			v-if="item"
			v-for="(item, index) in $store.state.guigeidname"
			:key="index"
			class="number"
			>{{$store.state.guigeName[index]}}&nbsp;{{item}}</span>
			<span class="btn-right"></span>
		</div>
		<div class="fenge"></div>

		<div class="for-discount" @click="showCoupon">
			<span class="discount_text">优惠</span>
			<span
				class="coupon_img"
				v-for="(item,index) in couponList.slice(0,2)"
              	:key="index.id">
         			满{{parseInt(item.condition)}}减{{parseInt(item.money)}}元
			</span>
			<span class="btn-right"></span>
			<div class="promotion-all">
			<div class="promotion-card" v-if="gift.length != 0">
				<div class="promotion-title" v-if="gift.name">{{gift.name}}</div>
					<img :src="URL + gift.pic_url" class="promotion-img">
					<div class="promotion-num" v-if="gift.give_num != 0 && gift.give_num != null">x{{gift.give_num}}</div>
					<div class="promotion-detail">满{{ gift.full }}元送赠品，数量{{gift.give_count}}赠完即止</div>
				</div>
				<div class="promotion-card"  v-if="reduction.length != 0">
					<div class="promotion-title" v-if="reduction.promation_name">{{reduction.promation_name}}</div>
					<div class="promotion-detail">满{{ reduction.full }}减{{reduction.expression}}</div>
				</div>
			</div>
		</div>
		<!--      <span-->
		<!--              class="coupon_img"-->
		<!--              >超级用户 VIP-->

		<!--      </span>-->
		<!--      <span-->
		<!--              class="coupon_message"-->
		<!--              v-for="item in data"-->
		<!--      >{{item.message}}-->

		<!--            </span>-->

		<!-- <div class="for-security">
				<button>产地证明</button>
				<span class="btn-right"></span>
			</div> -->
		<!-- <div class="for-security"> -->
		<!-- <button>朔源码</button> -->
		<!-- <span>{{newgood.source_code}}</span> -->
		<!-- </div> -->

		<!-- <div class="fenge"></div> -->

		<!-- <div class="for-discount">
			<span class="discount_text">
				促&nbsp;&nbsp;&nbsp;销
			</span>
			<span class="man">
				满赠
			</span>
			<span class="btn-right"></span>
			</div> -->


		<!-- <div class="fenge"></div> -->

		<!-- <el-tabs type="border-card" @tab-click="handleClick">
				<el-tab-pane label="推荐组合">
				<div>
					推荐组合
				</div>
				</el-tab-pane>
				<el-tab-pane label="优惠套餐">推荐套餐</el-tab-pane>
			</el-tabs> -->

		<div class="delivery_method">
			<div @click="callingArea">
			<div class="delivery_title">送至</div>
			<input v-if="addressAll1 == ''" placeholder="请选择地区" type="tel" class="delivery_input" disabled v-model="addressAllData">
        <input v-else placeholder="请选择地区" type="tel" class="delivery_input" disabled v-model="addressAll1">
        <span class="delivery_right"></span>
      </div>
      <!-- <div>
        <div class="delivery_title">运费</div>
        <div v-if="deliveryMoney == 0" class="delivery_busi">免配送费</div>
        <div v-else class="delivery_busi">￥{{deliveryMoney}}</div>
      </div> -->
      <div v-if="callStatus == 1">
        <div class="delivery_title">配送</div>
        <div v-if="deliveryCal == 0" class="delivery_busi">0 元</div>
        <div v-else-if="deliveryCal == -1" class="delivery_busi">免配送费</div>
        <div v-else class="delivery_busi">{{deliveryCal}} 元</div>
      </div>
      <div v-else-if="freightCal">
        <div class="delivery_title">运费</div>
        <!-- <div v-if="freightCal == 0.00" class="delivery_busi">0 元</div> -->
        <div v-if="freightCal == 0" class="delivery_busi">卖家包邮</div>
        <div v-else class="delivery_busi">{{freightCal}} 元</div>
      </div>
       <!-- <div v-else>
        <div class="delivery_title">运费</div>
        <div class="delivery_busi">{{freightCal}} 元</div>
      </div> -->
      <!-- <div v-else-if="callStatus == 0">
        <div class="delivery_title">z配送</div>
        <div v-if="deliveryStartMoney == ''" class="delivery_busi">g{{freightStartCal}} 元</div>
        <div v-else-if="deliveryStartMoney == 0.00" class="delivery_busi">h0 元</div>
        <div v-else-if="deliveryStartMoney == 0" class="delivery_busi">i免配送费</div>
        <div v-else class="delivery_busi">j{{deliveryStartMoney}} 元</div>
      </div> -->
    </div>
    
    <div class="fenge"></div>
  <div class="comment-display">
    <div class="for_comment" @click="goToComment">
      <span class="coupon_title">商品评论&nbsp;({{allCount}})</span>
      <span class="coupon_number"> 查看更多</span>
      <span class="btn-right"></span>
    </div>
    <!-- 暂无评论 -->
      <div v-if="dataItem == null" class="center"></div>
      <div v-else class="list-wrap" v-for="item in dataItem.slice(0,2)" :key="item.id + 'i'">
        <div class="list-hd clearfix">
            <div class="pull-left fl">
                <!-- <img src="../../../assets/user-d.jpg"> -->
                  <img :src="URL + item.user_header">
                <span >{{item.nick_name}}</span>
				</div>
				<div class="pull-right fr">
				<img v-for = 'n in parseInt(item.score)' :key = 'n' :src="imgYes">
                <img v-for = 'n in 5-parseInt(item.score)' :key ="n + 'i'" :src="imgNo">
				</div>
			</div>
			<div class="list-purTimer">{{Number(item.create_time)|formatDate}}</div>
			<div class="list-com">{{item.content}}</div>
			<div class="list-img-main clearfix" v-for="items in item.path" :key="items.id">
				<img :class="{ 'active': tempImgValue == items && isChoose  }"  @click="imgScc(items)" :src="URL + items.path" class="fl" >
			</div>
			</div>
		</div>
		<div class="fenge"></div>
		<div class="ans_display">
			<div class="for_ans" @click="goToQue">
			<span class="ans_title">商口咨询({{countTotal}})</span>
			<span class="ans_number"> 查看更多 </span>
			<span class="btn-right"></span>
			</div>
			<li v-for ="item in product.slice(0,2)" :key="item.id" class="product_li">
			<div class="use_area_head">
				<!-- <em>用户g***8的提问：</em> -->
				<!-- <span class="fr g_ask_time">{{formatTime(item.create_time)}}</span> -->
			</div>
			<p class="pro text1-hidden"><span class="g_icon">问</span> {{item.content}}</p>
        <p class="text1-hidden" v-if="item.answer"><span class="g_icon">答</span>{{item.answer}}</p>
			<div class="yigong" v-if="item.answer === null">暂无回复</div>
			<div class="yigong" v-else>已回复</div>
			<!-- <p class="text1-hidden color_grey" v-else><span class="g_icon">答</span> 暂无回答</p> -->
			<!-- <div class="g_look_more" v-if="item.answer" @click="lookMore(item.id)">查看全部1个回答</div> -->
			</li>
		</div>
		<div class="fenge"></div>

		<mt-popup v-model="popupVisible1" position="bottom" class="mint-popup-4">
			<div class="picker-toolbar">
			<span class="mint-datetime-action mint-datetime-cancel" style="color:#ff8000;" @click="cancleaddress">取消</span>  
          	<span class="mint-datetime-action mint-datetime-confirm" style="color:#ff8000;" @click="selectaddress">确定</span>  
			</div>
			<div class="select">
			<ul class="address-area-tit">
				<li
				v-model="prov"
					:class="showProvince?'active':''" 
                  	@click="selectedArea('province')">
                  	{{ province }}</li>
				<li
				v-model="Bcity"
				v-if="choiceCity"
					:class="showCity?'active':''"
                  	@click="selectedArea('city')">
                  	{{ city }}</li>
				<li
					v-model="district"
					v-if="choiceArea"
					:class="showArea?'active':''">
              		{{ area }}</li>
			</ul>
			<ul class="address-city" v-if="showProvince">
				<li
				v-for="(n, i) in addressPlace"
				@click="getProvince(n.id, n.name, i)"
				  :class="i==provinceIndex?'selected-li':''"
                  :key="i">
                  {{ n.name }}</li>
			</ul>
			<ul class="address-city" v-if="showCity">
				<li
				 v-for="(n, i) in cityArr"
				 @click="getCity(n.id, n.name, i)"
				 :class="i==cityIndex?'selected-li':''"
                  :key="i">
              {{ n.name }}</li>
			</ul>
			<ul class="address-city" v-if="showArea">
				<li
				v-for="(n, i) in districtArr"
				@click="setCityEnd(n.id, n.name, i)"
				:class="i==areaIndex?'selected-li':''"
				:key="i"
				>{{ n.name }}</li>
			</ul>
			</div>
		</mt-popup>

		<transition  name="fade">
			<div class="coupon_box" v-if="sta">
			<div class="box_main">
				<div class="box_header">
				<p class="box_text">领券</p>
				<span class="box_cross" @click="showCoupon">×</span>
				</div>
				<div class="promotion-all">
				<div class="pro_title" v-if="gift.length != 0">促销</div>
				<div class="promotion-card" v-if="gift.length != 0">
					<div class="promotion-title">{{gift.name}}</div>
            		<div class="promotion-detail">满{{ gift.full }}元送赠品，数量{{gift.give_count}}赠完即止</div>
				</div>
				<div class="showpormotion" v-if="gift.length != 0">
					<img :src="URL + gift.pic_url" class="showpormotion-img" v-if="gift.pic_url !=null">
					<div class="showpormotion-all">
						<div class="showpormotion-title">{{gift.title}}</div>
                		<div class="showpormotion-num" v-if="gift.give_num != 0 && gift.give_num != null">x{{gift.give_num}}</div>
					</div>
				</div>
				<div class="promotion-card" v-if="reduction.length != 0">
					<div class="promotion-title">{{reduction.promation_name}}</div>
            		<div class="promotion-detail">满{{ reduction.full }}减{{reduction.expression}}</div>
				</div>
				</div>
				<div class="box_box">
				<div class="cou_title">领券</div>
				<div class="box_body" v-for="(item,index) in couponList" :key="index.id" @click="couponReceive(index)">
					<div class="body_left">
					<span class="left_money">￥{{parseInt(item.money)}}</span>
                	<span class="left_name">{{item.name}}</span>
                

					<p class="condition">满{{parseInt(item.condition)}}元可以使用</p>


                	<p class="left_time">有效期 {{new Date(item.use_start_time * 1000).getFullYear()+'.'+(new Date(Number(item.use_start_time * 1000)).getMonth()+1)+'.'+new Date(Number(item.use_start_time * 1000)).getDate()}} - {{new Date(item.use_end_time * 1000).getFullYear()+'.'+(new Date(Number(item.use_end_time * 1000)).getMonth()+1)+'.'+new Date(Number(item.use_end_time * 1000)).getDate()}}</p>
					<span class="body_circle"></span>
					<span class="body_circle1"></span>
					</div>
					<div class="body_right">立即领取</div>
				</div>
				</div>
			</div>
			</div>
		</transition>

		<!-- 店铺 -->
		<shop-infor :shopData="shopData" :data="$store.state.commodity_data"></shop-infor>
		<!-- 搭配套餐推荐 -->
		<pr-list
			v-show="$store.state.matchGood"
			:conItem="conItemRe"
			:storeId="shopData.id"
			:val="1"
			:data="$store.state.matchGood"
		></pr-list>
		<!-- 猜你喜欢 -->
		<pr-list
			v-if="$store.state.dataLeave.length != 0 || $store.state.dataLeave.length"
			:conItem="conItem"
			:val="2"
			:data="$store.state.dataLeave"
		></pr-list>

		<!-- <div class="prompt" @click="toTab">点击查看更多商品信息</div> -->
		<div class="fenge"></div>
		</PullUpReload>

		<DropDownRefresh v-show="tabFlg1" :on-refresh="onRefresh">
		<detailspage></detailspage>
		</DropDownRefresh>

		<DropDownRefresh1 v-show="tabFlg2" :on-refresh="onRefresh1">
		<attributespage></attributespage>
		</DropDownRefresh1>

		<!-- <tab :productData="productTab"></tab> -->
		<detail-option
		@recommend="matchGood($store.state.commodity_data.goods.id)"
		v-if="guige"
		:data="$store.state.commodity_data"
		:productData="productData"
		@sendValue="sendValue"
		></detail-option>
		<Shopsn></Shopsn>
		<foot-btn
		:storeid="store__id"
		:state="sonState"
		:Number="$store.state.commodity_val"
		:data="$store.state.commodity_data"
		:productData = "productData"
		@reduce="reduce"
		@plus="plus"
		:money="this.$route.params.money"
		></foot-btn>
		<div class="load-wrap" v-show="load_wrap" @touchmove.prevent>
		<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
	</div>
</template>
<script>
import PrHeader from "@/components/page/children/shop_header.vue"; // 头部
import prList from "@/components/page/children/list.vue"; //猜你喜欢和搭配套餐
import FootBtn from "@/components/page/children/footBtn.vue"; // 底部按钮
import PageOption from "@/components/page/children/pageOption.vue";
import shopInfor from "@/components/page/children/shopInfor.vue"; // 店铺信息
import detailOption from "@/components/page/children/detailOptions.vue"; // 立即购买 || 加入购物车 弹框
import Shopsn from "@/components/page/Shopsn.vue";
import Tab from "@/components/page/children/tab.vue";
import DropDownRefresh from "./children/DropDownRefresn"; // 上拉刷新组件
import DropDownRefresh1 from "./children/DropDownRefresn1";
import PullUpReload from "./children/PullUpReload"; //下拉组件
import detailspage from "@/components/page/children/detailspage";
import attributespage from "@/components/page/children/attributespage";
import qs from "qs";
import { Popup } from "mint-ui";
import { Toast } from 'mint-ui';
import CountDown from "vue2-countdown";
import VueWeChatShare from 'vue-wechat-share'
// import WeChatShare from '../../lib/wechatSocialShare.js';
import WeChatShare from '../../utils/wxSocialshare.js'
import getJSSDK from '../../utils/wxpackage.js'
import wx from 'weixin-js-sdk'

import $ from "jquery";
export default {
  name: "product",
  data() {
    return {
      imgNo:require('@/assets/images/xinxin.png'),
      imgYes:require('@/assets/images/xu_xinxin.png'),
      popupHeader: null,
      activeName: 'first',
      product:'',
      popupVisible1:false,
      addressPlace:'',
      prov:'',
      cityArr:'',
      district:'',
      districtArr:'',
      Township:'',
      TownshipArr:'',
      addressAll1:'',
      popupVisible:false,
      popup:false,
      popupV:false,
      tempImgValue: '',
      isChoose:false,
      countTotal:0,

      addressAllData: '',
      addressPlaceName: '',
      cityArrName: '',
      areaArrName: '',

      data:{
        name:'',
        phone:'',
        address1:'',
        addressAll:'',
        addAll:'',
        Det:'',
        addressa:'',
        value:0,
      },
      isArea: false,  // 选择窗口显示隐藏
      choiceProvince: false, // 省按钮的显示隐藏
      choiceCity: false, // 市按钮的显示隐藏
      choiceArea: false, // 区按钮的显示隐藏
      choiceStreet:false,
      province: '请选择',    // 选中的省
      city: '请选择', // 选中的市
      area: '请选择', // 选中的区
      street:'请选择',//选中的街道
      showProvince: true, // 省选择的显示隐藏
      showCity: false, // 市选择的显示隐藏
      showArea: false, // 区选择的显示隐藏
      showStreet:false,//街道的显示隐藏
      provinceId: '', // 选中的省id
      cityId: '', // 选中的市id
      areaId: '', // 选中的区id
      streetId:'',
      provinceIndex: -1, // 选中态索引
      cityIndex: -1,
      areaIndex: -1,
      streetIndex:-1,
      getProvinceID: '',
      rec_address:'',
      deliveryMoney: '',
      deliveryCal: '',
      freightCal: '',
      // deliveryStartMoney: '',
      // freightStartCal: '',
      pro:false,
      sta:false,
      staheader:false,
      couponList:[],
      detail: '',
      detailId: null,
      detialSubId: null,
      option: '',
      opt:false,
      promotion: '',
      promotion_id: '',
      route_id: '',
      //是否显示状态条
      showIndicators: true,
      //初始轮播切换索引
      defaultIndex: 0,
      //轮播是否循环播放
      continuous: true,
      number: 1,
      conItem: {
        title: "猜你喜欢"
      },
      conItemRe: {
        title: "搭配套餐推荐"
      },
      scrollWatch: true,
      topStatus: "",
      loadTop: {},
      sonState: false,
      data: "",
      title: "商品详情",
      dataLeave: "",
      load_wrap: true,
      link_id: this.$route.params.id,
      guige: false,
      shopData: "",
      popupVisible: false,
      endday: "",
      end: "",
      brand: "",
      finish: false,
      images: [],
      page: 1,
      p_id: 0,
      store__id: 0,
      specification: '',
      specification_id: '',
      specific: '',
      specId: '',
      IId: '',
      specific_id: '',
      productData: '',
      detailAllData: '',
      tempequal: true,
      productTab: true,
      headBackgroundColor: {
        //头部背景色
        backgroundColor: "rgba(255,255,255,0)"
      },
      currentTab: 0,
      tabFlg: true,
      tabFlg1: false,
      tabFlg2: false,
      pullUpState: true,
      btnOpacity: {
        //分享按钮于返回按钮的btn
        opacity: 1,
        display: ""
      },
      btnOpacity1: {
        opacity: 0.1,
        display: "none"
      },
      tabOpacity: {
        //tab隐藏于显示
        opacity: 0
      },
      location:'',
      code:'',
      allCount: 0,
      dataItem:'',
      tempImgValue: '',
      isChoose:false,
      gift:[],
      reduction:[],
      callStatus: '',
      video:''
    };
  },
  props:{
    btn:null,
    set:null,
  },
  created() {
      this.$store.state.const_join = false;
      this.$store.state.catr_number = 0;
      this.$store.state.goods_id = "";
      this.$store.state.matchGood = "";
      this.axios
        .post(
          this.$httpConfig.goodSpecsByGoodsChildren,
          qs.stringify({
            id: this.$route.params.id
          })
        )
        .then(res => {
          if (res.data.status == 1) {
            this.specification = res.data.data;
            this.option = res.data.data.spec.spec_children[0].item;
            this.IId = res.data.data.spec.spec_children[0].id;



            let tempdata = this.specification.spec.spec_children
            this.tempequal = tempdata.every((val, i, arr) => val.spec_id == arr[0].spec_id)



            for (let i in this.specification.goods) {
              this.specId = res.data.data.goods[i].key.split("_");
              if(this.IId == this.specId || this.tempequal == false) {
                this.specific_id = res.data.data.goods[i].goods_id;

                this.axios({
                  url: this.$httpConfig.goodInfo,
                  method: "get",
                  params: {
                    id: this.specific_id
                  }
                })
                  .then(res => {
                    this.productData = res.data.data.goods;
                    this.video = res.data.data.video;
                    this.promotion = res.data.data.promotion;
                  })
                  .catch(err => {
                    console.log(err);
                  });
                this.axios
                  .post(
                    this.$httpConfig.matchGood,
                    qs.stringify({
                      goods_id: this.specific_id
                    })
                  )
                  .then(res => {
                    this.$store.state.matchGood = res.data.data;
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
      this.proAjax(0, 0);
      this.CArrName();
      this.AArrName();
      // this.apicall();
  },
  methods: {
      apicall() {
        this.axios.get(this.$httpConfig.wechatShareAPI)
          .then(res => {
              WeChatShare.wxRegister(res.data.data); //Just call directly
          }).catch((error) => {
              console.log(error)
          });
      },
      weChatJSCall() {
          let wxShareData = {
            title: "微信分享测试",
            linkurl: window.location.href, // location.origin + "/index.html#/test?shareId=154545",
            desc: "分享链接添加动态参数",
            img: "http://a2.att.hudong.com/36/48/19300001357258133412489354717.jpg",
          };
          getJSSDK.getJSSDK(wxShareData, "154545");
      },
      showvideo(video){
        window.location.href= video
      },
      imgScc(value){
          this.tempImgValue = value
          this.isChoose = !this.isChoose
      },
      comContent(){
            this.axios({
              url:this.$httpConfig.getAllCommentContent,
              method:'get',
              params:{
                  goods_id:this.$route.params.id,
                  type: 0,
                  status:4,
                  page:1
              }
          }).then((res) => {
              if(res.data.status==1){
                  this.dataItem= res.data.data.data.list;
                  this.allCount = res.data.data.data.allCount;
              }
              
          }).catch((err) => {
              console.log(err);
          });
      },
      goToComment(){
        this.$router.push({
          name: "commentPage",
          params: {
            id: this.$route.params.id,
            p_id: this.p_id
          }
        });
      },
      goToQue(){
        this.$router.push({
          name: "quesanswer",
          params: {
            id: this.$route.params.id,
            p: this.p_id  
          }
        });;
      },
      formatTime(t){
          var time = new Date(Number(t) * 1000);
          var Y = time.getFullYear();
          var m = time.getMonth() + 1;
          var d = time.getDate();
          if (m < 10) {
              m = '0' + m;
          }
          if (d < 10) {
              d = '0' + d;
          }
          return (Y + "-" + m + "-" + d);
      },
      imgScc(value){
          this.tempImgValue = value
          this.isChoose = !this.isChoose
      },
      productAjax(){
          this.axios({
              url:this.$httpConfig.goodsProblems,
              method:'get',
              params:{
                  goods_id:this.$route.params.id,
                  p:1
              }
          }).then((res) => {
              if(res.data.status == 1){
                  this.product = res.data.data.records;
                  this.countTotal= res.data.data.countTotal;
              }
          }).catch((err) => {
              console.log(err);
          });
      },
      addClass1() {
        if(this.staheader == false) {
          this.staheader = true;
        } else {
          this.staheader = false;
        }
      },
      
      copyLink(){
          this.popup = true;
          this.location = location.href
      },
      qrLink(){
          this.popupV = true;
          this.code = location.href

      },
      myFunction() {
        var copyText = document.getElementById("myInput");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
      },
      wbpage(){
          window.location.href='https://m.weibo.cn/quicklogin?r=https%3A%2F%2Fm.weibo.cn%2F%3Fjumpfrom%3Dweibocom'
      },
      qqpage(){
          window.location.href='https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=716027609&pt_3rd_aid=101019034&daid=383&pt_skey_valid=0&style=35&s_url=http%3A%2F%2Fconnect.qq.com&refer_cgi=authorize&which=&client_id=101019034&response_type=code&scope=get_info%2Cget_user_info&redirect_uri=https%3A%2F%2Fpassport.weibo.com%2Fothersitebind%2Fbind%3Fsite%3Dqq%26state%3DCODE-gz-1J7gz1-1Tj8eo-pCNJsg5lGBqf1WK0038e2%26bentry%3D3rdh5%26wl%3D%26callback%3Dhttp%253A%252F%252Flocalhost%253A8087%252Fproduct%252F161%252F1&display='
      },
      
      wxpage: function(event) {
          if(event) {
              let wxShareData = {
                title: "微信分享测试",
                linkurl: window.location.href,
                desc: "分享链接添加动态参数",
                img: "http://a2.att.hudong.com/36/48/19300001357258133412489354717.jpg",
              };
              wx.updateAppMessageShareData({
                  title: wxShareData.title,
                  desc: wxShareData.desc, 
                  link: wxShareData.linkurl, // window.location.href.split("#")[0],
                  imgUrl: wxShareData.img,
                  success: (res) => {
                      alert("AppMessage " + JSON.stringify(res));
                  },
              });
          }
      },
      initUrl: function(event) {
          // this.shareParams = location.href
          // this.$shareWeChat("shareParams");
          if(event) {
              let wxShareData = {
                title: "微信分享测试",
                linkurl: window.location.href,
                img: "http://a2.att.hudong.com/36/48/19300001357258133412489354717.jpg",
              };
              wx.updateTimelineShareData({
                  title: wxShareData.title,
                  link: wxShareData.linkurl, // window.location.href.split("#")[0],
                  imgUrl: wxShareData.img,
                  success: (res) => {
                      alert("Timeline " + JSON.stringify(res));
                  },
              });
          }
      },

    wxpage3() {
        var btn = document.getElementById("button");
        // btn.addEventListener('click', function(){
        btn.onclick = function() {
            let wxShareData = {
              title: "微信分享测试",
              linkurl: window.location.href,
              desc: "分享链接添加动态参数",
              img: "http://a2.att.hudong.com/36/48/19300001357258133412489354717.jpg",
            };
            
            wx.updateTimelineShareData({
                title: wxShareData.title,
                link: window.location.href.split("#")[0],
                imgUrl: wxShareData.img,
                success: (res) => {
                  alert("updateTimelineShareData " + JSON.stringify(res));
                },
            });
        }
    }, 
    wxpage1() {
        this.$wx.updateAppMessageShareData({
            title: "微信分享测试",
            linkurl: window.location.href, // location.origin + "/index.html#/test?shareId=154545",
            desc: "分享链接添加动态参数",
            img: "http://a2.att.hudong.com/36/48/19300001357258133412489354717.jpg",
            success: (res) => {
              alert("Success... " + JSON.stringify(res));
            },
            cancel: function () {
              console.log("Cancel sharing");
            },
        })
    },
    wxpage2() {
        document.getElementById('demo2').onclick = function(){
          let wxShareData = {
              title: "微信分享测试",
              linkurl: window.location.href, // location.origin + "/index.html#/test?shareId=154545",
              desc: "分享链接添加动态参数",
              img: "http://a2.att.hudong.com/36/48/19300001357258133412489354717.jpg",
          };
          wx.updateAppMessageShareData({
              title: wxShareData.title, 
              desc: wxShareData.desc, 
              link:
                window.location.href.split("#")[0],
                //  + "#" + 
                // window.location.href.split("#")[1]
              imgUrl: wxShareData.img, 
              success: (res) => {
                alert(JSON.stringify(res));
              },
              cancel: function () {
                console.log("Cancel sharing");
              },
					});
        }
    },
    wxpage0(){
        // window.location.href='https://mp.weixin.qq.com/'
        // alert(this.$constant.mainName)
        let data = {
          url: window.location.href.split("#")[0],
        };
        this.axios.post(this.$httpConfig.wechatShareAPI, qs.stringify({
            url: data.url
        })).then((res) => {
        let dataObj = res.data.data;
        if (res.data.status == 1) {
          wx.config({
            debug: true, 
            appId: dataObj.appId, 
            timestamp: dataObj.timestamp,
            nonceStr: dataObj.nonceStr, 
            signature: dataObj.signature, 
            jsApiList: [
              "updateAppMessageShareData",
              "updateTimelineShareData",
            ],
          });
          wx.ready(function () {
            let wxShareData = {
              title: "微信分享测试",
              linkurl: window.location.href, // location.origin + "/index.html#/test?shareId=154545",
              desc: "分享链接添加动态参数",
              img: "http://a2.att.hudong.com/36/48/19300001357258133412489354717.jpg",
            };
            wx.checkJsApi({
              jsApiList: [
                "updateAppMessageShareData"
              ],
              success: (res) => {
                alert(JSON.stringify(res));
              },
            });
            wx.updateAppMessageShareData({
              title: wxShareData.title, 
              desc: wxShareData.desc, 
              link:
                window.location.href.split("#")[0] +
                "#" +
                window.location.href.split("#")[1], 
              imgUrl: wxShareData.img, 
              success: (res) => {
                alert(JSON.stringify(res));
              },
              cancel: function () {
                Toast.fail("Cancel sharing");
              },
            });
          });
          wx.error(function(res) {
            console.log(JSON.stringify(res) + '微信验证失败')
            alert(JSON.stringify(res)+"微信验证失败");
          })
        }
        });
    },
    
    toLink(link) {
        this.$router.push({
          path: link
        });
	},
	popupData(value) {
		this.popupHeader = value
	},
	handleClick(tab, event) {
	
	},
    // touchEnd(e) {
    //   window.scrollTo(0,document.body.scrollHeight);
    // },
    callingArea(){
          this.popupVisible1 = true;
      },
      cancleaddress(){
          this.popupVisible1 = false;
      },
      selectaddress() {
        this.popupVisible1 = false;
        if(this.province==""||this.province=="请选择") {
          Toast('请选择地址');
        } else if(this.city==""||this.city=="请选择"){
          Toast('请选择地址');
        }else if(this.area==""||this.area=="请选择" ){
          Toast('请选择地址');
        }else{
          this.addressAll1 = this.province + '-' + this.city + '-' + this.area;
          this.choiceCity=false;// 市按钮的显示隐藏
          this.choiceArea=false; // 区按钮的显示隐藏
          this.choiceStreet=false;
          this.choiceProvince=true; // 省按钮的显示隐藏
          this.showStreet = false;
          this.showProvince=true;
          this.showCity = false; 
          this.showArea = false;
          this.province="请选择"
        }
			},
			proAjax(index, selId) {
					this.axios({
							method: 'get',
							url: this.$httpConfig.cityList,
							params: {
								parent_id: index,
								// id: ''
							}
						})
						.then((res) => {
							let data = res.data.data;
							if(selId == 0) {
								this.addressPlace = data;
							} else if(selId == 1) {
								this.cityArr = data;
							} else if(selId == 2) {
								this.districtArr = data;
							} else if(selId == 3) {
								this.TownshipArr = data;
              }
              this.addressPlaceName = this.addressPlace[6].name;
						}).catch((err) => {
							console.log(err);
						});
			},
			selectedArea(type) { // 按钮点击
          if (type == "province") {
              this.cityIndex = -1;
              this.areaIndex = -1;
              this.streetIndex=-1
              
              this.choiceCity = false;
              this.choiceArea = false;
              this.choiceStreet=false,
              
              this.showProvince = true;
              this.showCity = false;
              this.showArea = false;
              this.showStreet=false;
              
          } else if (type == "city") {
              this.cityIndex = -1;
              this.areaIndex = -1;
              this.streetIndex=-1
              this.choiceArea = false;
              this.choiceStreet=false;
              
              this.showProvince = false;
              this.showCity = true;
              this.showArea = false;
              this.showStreet=false;
          } 
      },
             
      getProvince (id, name, index) {
            this.getProvinceID = id;
            this.Bcity = '请选择'; // 选中的市
            this.area = '请选择';// 选中的区
            this.city = '请选择';
            this.choiceCity = true;
            this.province = name;
            this.provinceId = id;
            this.showProvince = false;
            this.showCity = true;
            this.showArea = false;
            this.showStreet=false;
            this.cityArr = this.proAjax(this.provinceId, 1);
            // this.getconfirmOrder();
            // this.getDeliveryCal();
      },
      getCity (id, name, index) { // 获取城市列表
            this.area = '请选择', // 选中的区
            this.choiceArea = true;
            this.city = name;
            this.cityId = id;
            this.showProvince = false;
            this.showCity = false;
            this.showArea = true;
            this.showStreet=false;
            this.districtArr = this.proAjax(this.cityId, 2);
        },
      setCityEnd(id, name, index) { // 区点完以后
            this.area = name;
            this.areaId = id;
            this.getDeliveryCal();
            // this.getFreightCal();
          },
      setStreetEnd(id, name, index) {
        this.street=name
      },
    // getAddress(){
    // 	this.axios.post(this.$httpConfig.getDefault).then((res) => {
    //       this.rec_address = res.data.data;
    //       this.getconfirmOrder();
    //       this.getDeliveryCal();
    //       this.getFreightCal();
    // 	}).catch((err) => {
    // 		console.log(err);
    // 	})
    // },
    // getconfirmOrder(){
    // 	this.axios.post(this.$httpConfig.requeryConfirmOrderId,qs.stringify({
    // 		store_id: this.$store.state.commodity_data.goods.store_id,
    //     // address_id: this.rec_address.id
    //     address_id: this.getProvinceID
    //     }),'post')
    //     .then((res) => {
    //     this.deliveryMoney=res.data.data.money;
    // 	}).catch((err) => {
    // 		console.log(err);
    // 	})
    // },
    getDeliveryCal(){
				this.axios.post(this.$httpConfig.deliveryCalcus,qs.stringify({
					store_id: this.$store.state.commodity_data.goods.store_id,
          goods_id: this.getProvinceID,
          }),'post')
          .then((res) => {
            this.callStatus = res.data.status;
          if(res.data.status == 1) {
          this.deliveryCal=res.data.data.money;
          }
          if(res.data.status == 0) {
            this.getFreightCal();
          }
				}).catch((err) => {
					console.log(err);
				})
      },
      getFreightCal(){
				this.axios.post(this.$httpConfig.freightCalcus,qs.stringify({
					store_id: this.$store.state.commodity_data.goods.store_id,
          goods_id: this.$route.params.id,
          prov_id: this.getProvinceID,
          dist_id: this.cityId,
          city_id: this.areaId,
          }),'post')
          .then((res) => {
          this.freightCal=res.data.data;
				}).catch((err) => {
					console.log(err);
				})
      },
      
      CArrName() {
        this.axios({
          method: 'get',
          url: this.$httpConfig.cityList,
          params: {
            parent_id: 31,
          }
        })
      .then(res => {
          this.cityArrName = res.data.data[4].name;
      });
    },

    AArrName() {
      this.axios({
        method: 'get',
        url: this.$httpConfig.cityList,
        params: {
          parent_id: 488,         
        }
      })
      .then(res => {
          this.areaArrName = res.data.data[0].name;
          this.addressAllData = this.addressPlaceName +'-'+ this.cityArrName +'-'+ this.areaArrName;
      });
      this.axios.post(this.$httpConfig.deliveryCalcus,qs.stringify({
					store_id: 2,
          goods_id: 31
          }),'post')
          .then((res) => {
            this.callStatus = res.data.status;
          if(res.data.status == 1) {
            // this.deliveryStartMoney=res.data.data.money;
            this.deliveryCal=res.data.data.money;
          }
          if(res.data.status == 0) {
            this.axios.post(this.$httpConfig.freightCalcus,qs.stringify({
            store_id: 2,
            goods_id: this.$route.params.id,
            prov_id: 31,
            dist_id: 488,
            city_id: 5020,
            }),'post')
            .then((res) => {
            // this.freightStartCal=res.data.data;
            this.freightCal=res.data.data;
          }).catch((err) => {
            console.log(err);
          })
        }
				}).catch((err) => {
					console.log(err);
        })
      },

      handleNotice() {
        location.replace(window.location.origin +
                "/" +"informOutline?x=" +
                1 +
                "&notice=1" +
                "&store_id=" +
                this.store__id +
                "&goods_id=" +
                this.route_id+'&main_id='+this.p_id)
      },
    countDown() {
      this.finish = true;
    },
    toTab() {
      this.$router.push({
        name: "tab",
        params: {
          id: this.$route.params.id,
          p_id: this.p_id
        }
      });
    },
    theSon() {
      this.$store.state.const_join = true;
      this.opt = !this.opt;

      this.axios({
        url: this.$httpConfig.goodInfo,
        method: "get",
        params: {
          id: this.specific_id
        }
      })
        .then(res => {
          this.productData = res.data.data.goods;
          this.video = res.data.data.video;
        })
        .catch(err => {
          console.log(err);
        });
    },
    myLove() {
      this.axios
        .post(this.$httpConfig.guessLove, qs.stringify({ page: this.page }))
        .then(res => {
          this.$store.state.dataLeave = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //属性
    // spec() {},
    optionSpec() {

      this.axios
        .post(
          this.$httpConfig.goodSpecsByGoodsChildren,
          qs.stringify({
            id: this.$route.params.id
          })
        )
        .then(res => {
          if (res.data.status == 1) {
            this.specification = res.data.data;
            this.option = res.data.data.spec.spec_children[0].item;
            this.IId = res.data.data.spec.spec_children[0].id;
            for (let i in this.specification.goods) {
              this.specId = res.data.data.goods[i].key.split("_");
              if(this.IId == this.specId) {
                this.specific_id = res.data.data.goods[i].goods_id;

                this.axios({
                  url: this.$httpConfig.goodInfo,
                  method: "get",
                  params: {
                    id: this.specific_id
                  }
                })
                  .then(res => {
                    this.productData = res.data.data.goods;
                    this.promotion = res.data.data.promotion;
                    this.video = res.data.data.video;
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    optionSpec2() {

        this.axios
                .post(
                        this.$httpConfig.goodSpecsByGoodsChildren,
                        qs.stringify({
                          id: this.$route.params.id
                        })
                )
                .then(res => {
                  if (res.data.status == 1) {
                    this.specification = res.data.data;
                    this.option = this.detailAllData.item
                    this.IId = this.detailAllData.id
                    for (let i in this.specification.goods) {
                      this.specId = res.data.data.goods[i].key.split("_");
                      if(this.IId == this.specId) {
                        this.specific_id = res.data.data.goods[i].goods_id;

                        this.axios({
                          url: this.$httpConfig.goodInfo,
                          method: "get",
                          params: {
                            id: this.specific_id
                          }
                        })
                                .then(res => {
                                  this.productData = res.data.data.goods;
                                  this.promotion = res.data.data.promotion;
                                  this.video = res.data.data.video;
                                })
                                .catch(err => {
                                  console.log(err);
                                });
                      }
                    }
                  }
                })
                .catch(err => {
                  console.log(err);
                });
      },
      matchGood(id) {
        this.axios
                .post(
                        this.$httpConfig.matchGood,
                        qs.stringify({
                          goods_id: id
                        })
                )
                .then(res => {
                  this.$store.state.matchGood = res.data.data;
                })
                .catch(err => {
                  console.log(err);
                });
      },
      shopInfo() {
        this.axios({
          url: this.$httpConfig.shopInfo,
          method: "get",
          params: {
            id: this.$store.state.commodity_data.goods.store_id
          }
        })
                .then(res => {
                  this.shopData = res.data.data;
                })
                .catch(err => {
                  console.log(err);
                });
      },
      //商品详情
      ax() {
        this.axios({
          url: this.$httpConfig.goodInfo,
          method: "get",
          params: {
            id: this.$route.params.id
          }
        })
                .then(res => {
          if (res.data.data.cart_count) {
            this.$store.state.catr_number = parseInt(res.data.data.cart_count);
          }
          this.brand = res.data.data.brand_id;
          this.images = res.data.data.images;
          this.brand = res.data.data.brand_id;
          this.$store.state.commodity_data = res.data.data;
          this.$store.state.commodity_val = 1;
          this.matchGood(this.$store.state.commodity_data.goods.id);
          this.shopInfo();
          this.guige = true;
          this.load_wrap = false;
          this.p_id = res.data.data.goods.p_id;
          this.store__id = res.data.data.goods.store_id;
          this.route_id = res.data.data.goods.id;
          this.promotion = res.data.data.promotion;
          this.promotion_id = res.data.data.promotion.goods_id;

          this.CouponSendList();
          this.gift = res.data.data.promotion.gift;
          this.reduction = res.data.data.promotion.reduction;
          this.video = res.data.data.video;
        })
        .catch(err => {
          console.log(err);
        });
    },
    CouponSendList() {
      // console.log("ssssssss " + JSON.stringify(this.$store.state.commodity_data))
      this.axios({
        url: this.$httpConfig.CouponSendList,
        method: "get",
        params: {
          // store_id: 2,
          store_id: this.$store.state.commodity_data.goods.store_id
        }
      })
        .then(res => {
          this.couponList = res.data.data.records;
        })
        .catch(err => {
          console.log(err);
        });
    },
    showPromotion() {
      this.pro = !this.pro;
    },
    showCoupon() {
      this.sta = !this.sta;
    },
    sendValue(detail, id, subid){
        this.detail = detail.item
        this.detailId = id
        this.detialSubId = subid
        this.detailAllData = detail
        this.optionSpec2();
      },
      couponReceive(id) {
        let selectedId = this.couponList[id]
        this.axios({
          url: this.$httpConfig.couponReceiveBehavior,
          method: "get",
          params: {
            id: selectedId.id
          }
        })
                .then(res => {
                  Toast({
                    message: res.data.message,
                    position: "middle",
                    duration: 1000
                  });
                })
                .catch(err => {
                  console.log(err);
                });
      },
    reduce() {
      if (this.number <= 1) return;
      this.number--;
    },
    plus() {
      if (this.number >= this.data.minStock) return;
      this.number++;
    },
    fenxiang() {
      this.popupVisible = !this.popupVisible;
    },
    off() {
      this.popupVisible = false;
    },
    goLastPage() {
      this.$router.go(-1);
    },
    handTab(index) {
        if (index != this.currentTab) {
            this.currentTab = index;
            if (index == 1) {
                this.tabFlg1 = true;
                this.tabFlg2 = false;
                this.btnOpacity1.display = "";
                this.btnOpacity.display = "none";
                this.btnOpacity1.opacity = 1;
                this.headBackgroundColor.backgroundColor =
                    "rgb(255,255,255)";
                this.tabOpacity.opacity = 1;
                this.slide(1);
            }
            else if(index == 2){
                this.tabFlg2 = true;
                this.tabFlg1 = false;
                this.btnOpacity1.display = "";
                this.btnOpacity.display = "none";
                this.btnOpacity1.opacity = 1;
                this.headBackgroundColor.backgroundColor =
                    "rgb(255,255,255)";
                this.tabOpacity.opacity = 1;
                this.slide(2);
            }
            else {
                this.tabFlg = true;
                this.tabFlg1 = false;
                this.tabFlg2 = false;
                this.slide(0);
            }
        }
    },
    onRefresh() {
      //上拉事件
      this.currentTab = 0;
      this.tabFlg = true;
      this.tabFlg1 = false;
      this.tabFlg2 = false;
      this.slide(0);
    },
    onRefresh1() {
      //上拉事件
      this.currentTab = 0;
      this.tabFlg = true;
      this.slide(0);
    },
    onInfiniteLoad(done) {
      //下拉事件
      this.currentTab = 1;
      this.tabFlg1 = true;
      this.btnOpacity1.display = "";
      this.btnOpacity.display = "none";
      this.btnOpacity1.opacity = 1;
      this.headBackgroundColor.backgroundColor = "rgb(255,255,255)";
      this.tabOpacity.opacity = 1;
      this.slide(1);
    },
    slide(type) {
          var that = this;
          if (type) {
              var loadMoudle = document.getElementById("loadMoudle");
              this.distance =
                  loadMoudle.clientHeight || loadMoudle.offsetHeight; //获取商品信息总高度 也就是下拉获取图文详情需要滑动的距离
              // var time = setInterval(function () {
              //     if (document.body.scrollTop + 20 > that.distance) { //防止滑动距离超出
              //         document.body.scrollTop = that.distance
              //         that.tabFlg = false; // 滑动结束后隐藏商品信息
              //     } else {
              //         document.body.scrollTop = document.body.scrollTop + 20;
              //     }
              //     if (document.body.scrollTop >= that.distance) {
              //         clearInterval(time);
              //         $('html,body').animate({scrollTop: 0}, 0);
              //
              //     }
              // }, 10);
              $("html,body").animate(
                  {scrollTop: this.distance},
                  0,
                  function () {
                      that.tabFlg = false; // 滑动结束后隐藏商品信息
                      document.body.scrollTop = 0;
                  }
              );
          } 
          else if(type){
              window.scrollTo(0, this.distance);
              var that = this;

              $("html,body").animate({scrollTop: 0}, 0, function () {
                  that.tabFlg1 = false; // 滑动结束后隐藏商品信息
              });
          } 
          else {
              window.scrollTo(0, this.distance);
              var that = this;

              $("html,body").animate({scrollTop: 0}, 0, function () {
                  that.tabFlg2 = false; // 滑动结束后隐藏商品信息
              });
          }
      },
  },
  mounted() {
	this.weChatJSCall();
	








    this.$store.state.selectionSpec = [];
    $("html,body").animate(
      {
        scrollTop: "0px"
      },
      100
    );
    var that = this;
    $(window).scroll(function () {
      if (!that.currentTab) {
        that.headBackgroundColor.backgroundColor =
          "rgba(255,255,255," + $(window).scrollTop() / 200 + ")";
        that.tabOpacity.opacity = $(window).scrollTop() / 400;
        if (that.btnOpacity.opacity < 0) {
          that.btnOpacity.display = "none";
          that.btnOpacity1.display = "";
          that.btnOpacity1.opacity = $(window).scrollTop() / 200;
          that.btnOpacity.opacity = 1 - $(window).scrollTop() / 100;
        } else {
          that.btnOpacity1.display = "none";
          that.btnOpacity.display = "";
          that.btnOpacity.opacity = 1 - $(window).scrollTop() / 100;
        }
        if ($(window).scrollTop() <= 0) {
          that.btnOpacity1.display = "none";
          that.btnOpacity.display = "";
        }
      }
    });
    this.productAjax();
    this.comContent();
    this.ax();
    this.myLove();
    // this.spec();
    // this.CouponSendList();
    this.optionSpec();
    // this.getAddress();
    this.proAjax(0, 0);
    $("html,body").animate(
      {
        scrollTop: "0px"
      },
      100
    );
  },
  destroyed() {
    this.scrollWatch = false;
  },
  components: {
    PrHeader,
    Shopsn,
    prList,
    FootBtn,
    shopInfor,
    PageOption,
    detailOption,
    Tab,
    CountDown,
    DropDownRefresh,
    DropDownRefresh1,
    PullUpReload,
    detailspage,
    attributespage
  }
};
</script>

<style>
  .el-tabs__nav {
      white-space: nowrap;
      position: inherit;
      transition: -webkit-transform .3s;
      transition: transform .3s;
      transition: transform .3s,-webkit-transform .3s;
      float: left;
      z-index: 2;
  }
  .hd-active[data-v-7e3643f0] {
      width: 100%;
      height: 0 !important;
      padding: 0 !important;
  }
  .btm[data-v-1f8c3b2a] {
      width: 100%;
      height: 1rem;
      background-color: #fff;
      display: flex;
      padding: 0.15rem;
      box-sizing: border-box;
      position: relative !important;
      margin-bottom: .2rem !important;
  }
  </style>
  <style lang="less" scoped>

  .header {
      position: fixed;
      width: 96%;
      top: 0;
      left: 0;
      height: 0.9rem;
      height: 0.65rem;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 2%;
      z-index: 1;

      .return,
      .return1 {
          // background: url("../../assets/arrow1@2x.png");
          background-size: cover;
          width: 0.5rem;
          height: 0.5rem;
          position: absolute;
          left: .3rem;
          top: .2rem;
      }

      .return1 {
          // background: url("../../assets/fanhui.png");
          background: url("../../assets/arrow1@2x.png");
          background-size: cover;
          width: 0.5rem;
          height: 0.5rem;
      }

      .share,
      .share1 {
          background: url("../../assets/share1@2x.png");
          background-size: cover;
          width: 0.5rem;
          height: 0.5rem;
      }

      .share1 {
          background: url("../../assets/share3@2x.png");
          background-size: cover;
          width: 0.4rem;
          height: 0.4rem;
      }

      .tab {
          height: 0.5rem;
          display: flex;
          width: 2rem;
          border-radius: 0.1rem;
          opacity: 0;

          > div {
              width: 1rem;
              text-align: center;
              line-height: 0.5rem;
              box-sizing: border-box;
              background: #fff;
              border: 1px solid #b0b0b0;
          }

          .active {
              background: #787878;
              color: #fff;
              border: none;
          }

          > div:nth-child(1) {
              border-radius: 0.1rem 0 0 0.1rem;
          }

          > div:nth-child(2) {
              border-radius: 0 0 0 0;
              border-left: none;
          }

          > div:nth-child(3) {
              border-radius: 0 0.1rem 0.1rem 0;
              // border-left: none;
          }
      }
  }
  .btn-ng {
      position: absolute;
      // top: .17rem;
      top: .06rem;
      right: .2rem;
      width: .53rem;
      height: .53rem;
        span {
          display: block;
          border: .03rem solid #fff;
          border-radius: 50%;
          box-sizing: border-box;
          margin-left: .08rem;
          margin-top: .22rem;
        }
      }
    .headerimg{
      width: .5rem;
      position: absolute;
      height: .53rem;
      left: .2rem;
    }
      .fade-enter-active,
    .fade-leave-active {
      transition: opacity .5s;
    }
    
    .fade-enter,
    .fade-leave-to {
      opacity: 0
    }
    .box-wrap{
              position:fixed;
              width: 100%;
              height: 100%;
              left:0;
              top:0;
              z-index:99;
              .box-bg{
                  position:absolute;
                  left:0;
                  top:0;
                  width: 100%;
                  height: 100%;
                  z-index:1;
              }
              .bomb-box{
                  background:#535353;
                  padding:.11rem;
                  box-sizing: border-box;
                  position: absolute;
                  right:.15rem;
                  top:.8rem;
                  border-radius:5px;
                  z-index:99999;
                  color:#ffffff;
                  .polygon{
                      width: .4rem;
                      height: .4rem;
                      position:absolute;
                      top:0;
                      left:.8rem;
                      transform: rotate(45deg);
                      background:#535353;
                  }
                  .btn:nth-child(2){
                      border-bottom:1px solid #666;
                      .icon{
                          i{
                              width: .24rem;
                              height: .24rem;
                              background:url(../../assets/home.png) no-repeat;
                              background-size:100% 100%;
                          }
                      }
                  }
                  .btn:nth-child(3){
                      border-top:1px solid #444;
                      .icon{
                          i{
                              width: .24rem;
                              height: .24rem;
                              background:url(../../assets/news1.png) no-repeat;
                              background-size:100% 100%;
                          }
                      }
                  }
                  .btn:nth-child(4) {
            border-top: 1px solid #444;
            .icon {
              i {
                width: .24rem;
                height: .24rem;
                background: url(../../assets/sharebtn.png) no-repeat;
                background-size: 100% 100%;
              }
            }
          }
                  .btn{
                      width: 1.1rem;
                      height: .56rem;
                      box-sizing: border-box;
                      text-align:center;
                      line-height: .56rem;
                      position:relative;
                      padding-left:.5rem;
                      font-size:.24rem;
                      .icon{
                          position:absolute;
                          left:0;
                          top:0;
                          width: .56rem;
                          height: 100%;
                          margin:0;
                          border:none;
                          background:none;
                          i{
                              position:absolute;
                              left:0%;
                              top:0%;
                              bottom:0;
                              right:0;
                              margin:auto;
                          }
                      }
                  }
              }
          }
  .pop{
    width: 100%;
    }
    .copy {
              width: 100%;
              height: 2.8rem;
              .copy_header {
                  padding: .4rem .3rem;
                  text-align: center;
                  border-bottom: 1px solid #f1f1f1;
                  .copy_text {
                      font-size: .34rem;
                      color: #333;
                  }
              }
          }
          .link {
              padding: .4rem;
              .copy_link {
                  width: 5.4rem;
                  height: .7rem;
                  border: 1px solid #999;
                  font-size: .28rem;
                  color: #333;
                  padding-left: .2rem;
              }
              .copy_button {
                  width: 1rem;
                  height: .7rem;
                  border: none;
                  font-size: .28rem;
                  color: #333;
                  padding: 0 .1rem;
              }
          }
          .qrDiv {
              /*width: 70%;*/
          .qr {
              width: 100%;
              height: auto;
              .qr_header {
                  padding: .4rem .3rem;
                  text-align: center;
                  border-bottom: 1px solid #f1f1f1;
                  .qr_text {
                      font-size: .34rem;
                      color: #333;
                  }
              }
              .qr_code {
                  padding: .3rem;
                  }
              }
          }
          .share_box {
              width: 100%;
                  .box_header {
                      padding: .4rem .3rem;
                      text-align: center;
                      border-bottom: 1px solid #f1f1f1;
                      .box_text  {
                          font-size: .34rem;
                          color: #333;
                      }
                      .box_cross {
                          position: absolute;
                          right: 3%;
                          top: 0.38rem;
                          width: 0.4rem;
                          line-height: 0.34rem;
                          height: 0.4rem;
                          border: 1px solid #bfbfbf;
                          text-align: center;
                          font-size: 0.4rem;
                          color: #bfbfbf;
                          border-radius: 100%;
                      }
                  }
                  .share_logo{
                      color: #c5c5c5;
                      text-align: left;
                      padding:0.19rem;
                  }
                      .up{    
                          padding-bottom: 0.65rem;
                          border-bottom: .01rem solid;
                          margin: 0 .1rem 0 .1rem;

                          img{
                              padding: .25rem;
                          }
                          .up_text{
                                position: absolute;
                                top: 3rem;
                                display: inline-flex;
                                font-size: 0.29rem;
                                margin-left: -1.5rem;
                          }
                      }
                      .dn{
                          display: flex;
                          margin-left: .2rem;
                          
                          .account{
                            width: 25%;
                            padding: 0.3rem 0 0 0.1rem;

                            .txt{
                                padding: 0 0rem 0 .13rem;
                            }
                          }
                      }
          }
  .down-tip {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: fixed; 
    z-index: 1; 
    bottom: 100px;
  }
  .down-tip1 {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: fixed; 
    z-index: 0; 
  }
  .down-tip-img {
    width: 0.8rem;
    height: 0.8rem;
    transition: 0.5s;
    margin-bottom: 0.1rem;
  }
  .rotate {
    transform: rotate(-180deg);
  }
  .mint-popup-bottom{
              width: 100%;
              // padding:.2rem;
              box-sizing: border-box;
              .select{
                  padding:.2rem 0;
                  select{
                      padding-left:10/100rem;
                      border: 1/100rem solid #d9d9d9;
                      width: 24%;
                      height: .5rem;
                      background:#fff;
                      outline: none;
                      option{
                          color:#333;
                          text-align: center;
                      }
                  }
              }
          }
  .address-area-tit {
              padding: 0;
              box-shadow: none;
              border-bottom: 0;
              height:41px;
          }
          .address-area-tit li {
              cursor: pointer;
              position: relative;
              left: 0;
              top: 1px;
              padding: 0 .2rem;
              height:40px;
              width: 24%;
              overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
              text-align: center;
              font-size: 12px;
              display: inline-block;
              border-bottom: 1px solid #ccc;
          }
          .address-area-tit li.active {
              border-bottom: 1px solid #ff8000;
              color: #ff8000;
          }
          .address-city {
            margin-top: 10px;
              // height:4.5rem;
              // height:17.6rem;
              height:20rem;
              overflow: hidden;
              overflow-y: scroll;
              width: calc(100% + 30px);

          }
          .address-city li{
              padding: 0 35px;
              line-height: 30px;
              font-size: 12px;
              cursor: pointer;
          }
          .address-city li.selected-li {
              color: #ff8000;
          }
    .Promotions {
      display: flex;
      padding: 15/100rem 20/100rem;
      h4 {
        color: #a2a2a2;
        font-size: 32/100rem;
        margin-right: 20/100rem;
      }
      .promotionsDiv {
        display: flex;
        padding: 10/100rem;
        align-items: center;
        span {
          padding: 8/100rem;
          color: #e2252b;
          border: 1/100rem solid #e2252b;
          font-size: 24/100rem;
          // width: 100/100rem ;
          height: 25/100rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        p {
          margin-left: 20/100rem;
          font-size: 24/100rem;
          color: #656565;
        }
      }
    }

    .fenge {
      height: 20/100rem;
      background-color: #f1f1f1;
    }

    .product {
      background: #fff;
    }
    .for-discount {
      margin: .15rem .2rem;
      // height: .42rem;
      padding-top: .06rem;
      /*margin: .2rem;*/
      /*border-bottom: .01rem solid #F1F1F1;*/
      padding-bottom: 0.13rem;
      .man {
        width: 46px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        background: #d02629;
        color: #fff;
        display: inline-block;
        margin-left: 10px;
      }
      .discount_text {
        font-size: .26rem;
        color: #777;
        /*padding-top: .1rem;*/
        /*vertical-align: middle;*/
      }
      .coupon_img {
        background: url(../../assets/coupon.png) no-repeat;
        background-size: 100% 100%;
        // width: 2.2rem;
        // height: .44rem;
        font-size: .21rem;
        color: #ffffff;
        text-align: center;
        padding: .08rem .3rem;
        line-height: 1.91;
        margin-left: .2rem;
      }
      .btn-right {
        position: absolute;
        right: 0.3rem;
        /*top: 79%;*/
        margin-top: 0.07rem;
        width: 0.16rem;
        height: 0.3rem;
        background: url(../../assets/btn-right.png) no-repeat;
        background-size: 100% 100%;
      }
      img {
        width: 2rem;
        height:0.5rem;
        padding-left: .2rem;
      }
      .for-security {
        margin: .2rem;
        button {
          background: #FAE9E6;
          color: #DC4703;
          border: none;
          width: 1.3rem;
          height: 0.4rem;
          font-size: .26rem;
          margin: 0.07rem 0 0 .6rem;
          border-radius: .05rem;
        }
        img {
          width: 2.7rem;
          // height: 1rem;
          height:0.6rem;
          margin: 0 0 0 .7rem;
        }
        span{
          font-size: .3rem;
          margin: 0 0 0 2.3rem;
        }
        .btn-right {
          width: 0.22rem;
          height: 0.32rem;
          margin: .15rem 0 0 0;
          background: url(../../assets/btn-right.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      .promotion-all{
        // padding-top: .1rem;
        .promotion-card{
          display: flex;
          .promotion-title{
            font-size: .2rem;
            color: #e4393c;
            border: .01rem solid #e4393c;
            padding: .03rem .04rem .04rem .04rem;
            margin: .2rem .2rem .1rem .8rem;
          }
          .promotion-img{
            width: .5rem;
            height: .5rem;
            margin: .1rem 0 0 0;
            padding: 0;
          }
          .promotion-num{
            color: #d02629;
            margin: .25rem 0 0 .1rem;
          }
          .promotion-detail{
            font-size: .24rem;
            margin: .2rem 0 0 .1rem;
            color: #444;
          }
        }
      }
    }

    .promotion_box {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
      .promotion_main {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background: #fff;
        border-top-left-radius: .3rem;
        border-top-right-radius: .3rem;
        .promotion_header {
          padding: .4rem .3rem;
          text-align: center;
          border-bottom: 1px solid #f1f1f1;
          .promotion_text  {
            font-size: .34rem;
            color: #333;
          }
          .promotion_cross {
            position: absolute;
            right: 3%;
            top: 0.38rem;
            width: 0.4rem;
            line-height: 0.34rem;
            height: 0.4rem;
            border: 1px solid #bfbfbf;
            text-align: center;
            font-size: 0.4rem;
            color: #bfbfbf;
            border-radius: 100%;
          }
        }
        .box_promotion {
          padding: 0 0 .3rem 0;
          height: 8.85rem;
          overflow-y: scroll;
          position: relative;
        }
      }
    }

    .coupon_box {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
      .box_main {
        position: absolute;
        top:7rem;
        left: 0;
        bottom: 0;
        width: 100%;
        background: #fff;
        border-top-left-radius: .3rem;
        border-top-right-radius: .3rem;
        .box_header {
          padding: .4rem .3rem;
          text-align: center;
          border-bottom: 1px solid #f1f1f1;
          .box_text  {
            font-size: .34rem;
            color: #333;
          }
          .box_cross {
            position: absolute;
            right: 3%;
            top: 0.38rem;
            width: 0.4rem;
            line-height: 0.34rem;
            height: 0.4rem;
            border: 1px solid #bfbfbf;
            text-align: center;
            font-size: 0.4rem;
            color: #bfbfbf;
            border-radius: 100%;
          }
        }
        .promotion-all{
          // padding-top: .1rem;
          .pro_title{
            color: #262626;
            font-weight: 700;
            font-size: .23rem;
            margin: .2rem 0 0 .3rem;
          }
          .promotion-card{
            display: flex;
            .promotion-title{
              font-size: .2rem;
              color: #e4393c;
              border: .01rem solid #e4393c;
              padding: .03rem .04rem;
              margin: .3rem .2rem .1rem .3rem;
              height: .32rem;
            }
            .promotion-detail{
              font-size: .24rem;
              margin-top: .3rem;
              color: #444;
            }
          }
          .showpormotion{
              margin: 0 .2rem 0 .3rem;
              display: flex;
            .showpormotion-img{
              width: 1rem;
              height: 1rem;
              margin: .2rem 0 0 0;
            }
            .showpormotion-all{
              padding: .2rem 0 .2rem .2rem;
              .showpormotion-title{
                font-size: .21rem;
                line-height: .3rem;
              }
              .showpormotion-num{
                color: #d02629;
                font-size: .21rem;
                margin: .1rem 0 0 0;
              }
            }
          }
        }
        .box_box {
          padding: 0 0 .3rem 0;
          height: 8.85rem;
          overflow-y: scroll;
          position: relative;
          .cou_title{
            color: #262626;
            font-weight: 700;
            font-size: .23rem;
            margin: .2rem 0 0 .3rem;
          }
          .box_body {
            padding: .3rem;
            margin-bottom: 1.5rem;
            color: #dc7676;
            .body_left {
              background: url(../../assets/background1.png) no-repeat;
              background-size: 100% 100%;
              width: 4.57rem;
              height: 1.8rem;
              left: 3%;
              position: absolute;
              border-right: 2px dotted #dc7676;
            }
            .left_money {
              font-size: .42rem;
              margin: .2rem;
              line-height: 1.1rem;
            }
            .left_name {
              font-size: .3rem;
            }
            .condition{
              padding-left: .3rem;
              line-height: 0.55rem;
              margin-top: -0.3rem;
            }
            .left_time {
              font-size: .26rem;
              margin-left: .26rem;
            }
            .body_circle {
              background: url(../../assets/circle.png) no-repeat;
              background-size: 100% 100%;
              position: absolute;
              width: .3rem;
              height: .3rem;
              top: -7%;
              left: 96.2%;
              z-index: 1;
            }
            .body_circle1 {
              background: url(../../assets/circle.png) no-repeat;
              background-size: 100% 100%;
              position: absolute;
              width: .3rem;
              height: .3rem;
              top: 91%;
              right: -2.7%;
              z-index: 1;
            }
            .body_right {
              background: url(../../assets/background2.png) no-repeat;
              background-size: 100% 100%;
              width: 2.5rem;
              height: 1.8rem;
              right: 3%;
              position: absolute;
              font-size: .3rem;
              color: #dc7676;
              text-align: center;
              line-height: 1.8rem;
            }
          }
        }
      }
    }
    .see-video{
      width: 100%;
      margin: -2rem 0 0 0;
      position: absolute;
      z-index: 20;
      text-align: center;
      padding: .2rem 0 .2rem 0;
      .playimg{
        width: 1rem;
        height: 1rem;
      }
    }
    .describe {
      padding: 0 0.2rem 0.35rem 0.2rem;
      position: relative;
      background-color: #f1f1f1;
      .fn {
        font-size: 0.36rem;
        color: #333;
        padding-top: 0.3rem;
        line-height: 0.5rem;
        display: -webkit-box;
        overflow: hidden;
        white-space: normal !important;
        text-overflow: ellipsis;
        word-wrap: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .timer {
        font-size: 0.25rem;
        color: #e02828;
        padding: 0.3rem 0;
        .newPos {
          color: #f1302b;
        }
      }
      .price.active {
        .orc {
          line-height: 0.4rem;
          padding-bottom: 0.2rem;
          .icon {
            width: 0.4rem;
            height: 0.4rem;
            background: url(../../assets/integral.png) no-repeat;
            background-size: 100% 100%;
            margin-right: 0.2rem;
          }
        }
        .new {
          padding: 0;
        }
      }
      .price {
        padding-top: 0.2rem;
        .orc {
          color: #e02828;
          font-size: 0.32rem;
          em {
            font-style: normal;
            font-size: 0.48rem;
          }
        }
        .new {
          color: #757575;
          font-size: 0.25rem;
          padding-left: 0.2rem;
          s {
            font-size: 0.24rem;
          }
        }
        .report {
          float: right;
          font-size: .28rem;
          color: red;
        }
      }
      .share {
        position: absolute;
        right: 0.2rem;
        top: 0.3rem;
        text-align: center;
        .icon {
          display: block;
          width: 0.39rem;
          height: 0.42rem;
          background: url(../../assets/share.png) no-repeat;
          background-size: 100% 100%;
        }
        p {
          font-size: 0.24rem;
          color: #555;
          line-height: 0.5rem;
        }
        ul {
          position: absolute;
          top: 45px;
          left: -225%;
          li {
            width: 0.4rem;
            height: 0.4rem;
            float: left;
            margin: 3px;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .promotion {
      padding: 0.1rem 0.5rem 0.1rem 0.2rem;
      color: #777;
      position: relative;
      background: #fff;
      .title {
        font-size: .26rem;
        padding: 0.15rem 0.2rem 0 0;
        position: absolute;
      }
      .body {
        margin-left: .7rem;
        .text {

          .name {
            font-size: .26rem;
            border: 1px solid #d02629;
            border-radius: .06rem;
            color: #d02629;
            line-height: 2.5;
            padding: 0 .04rem;
          }
          .full {
            font-size: .26rem;
            padding-left: .1rem;
          }
        }
      }
      .btn-right {
        position: absolute;
        right: 0.3rem;
        top: 50%;
        margin-top: -0.15rem;
        width: 0.16rem;
        height: 0.3rem;
        background: url(../../assets/btn-right.png) no-repeat;
        background-size: 100% 100%;
      }
    }
    .date-selected {
      padding: 0 0.5rem 0 0.2rem;
      min-height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.3rem;
      color: #777;
      position: relative;
      background: #fff;
      border-top: 1px solid #f1f1f1;
      .title {
        font-size: .26rem;
        color: #777;
      }
      .number {
        font-size: 0.28rem;
        color: #333;
        padding-left: 0.55rem;
      }
      .btn-right {
        position: absolute;
        right: 0.3rem;
        top: 50%;
        margin-top: -0.15rem;
        width: 0.16rem;
        height: 0.3rem;
        background: url(../../assets/btn-right.png) no-repeat;
        background-size: 100% 100%;
      }
    }
    .selected {
      padding: 0 0.5rem 0 0.2rem;
      min-height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.3rem;
      color: #777;
      position: relative;
      background: #fff;
      border-top: 1px solid #f1f1f1;
      .title {
        font-size: .26rem;
        color: #777;
      }
      .number {
        font-size: 0.28rem;
        color: #333;
        padding-left: 0.55rem;
      }
      .btn-right {
        position: absolute;
        right: 0.3rem;
        top: 50%;
        margin-top: -0.15rem;
        width: 0.16rem;
        height: 0.3rem;
        background: url(../../assets/btn-right.png) no-repeat;
        background-size: 100% 100%;
      }
    }

    .delivery_method {
      padding: 0 0.5rem 0 0.2rem;
      min-height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.3rem;
      color: #777;
      position: relative;
      background: #fff;
      border-top: 1px solid #f1f1f1;
      .delivery_title {
        width: 2rem;
        font-size: .26rem;
        color: #777;
      }
      .delivery_busi {
        font-size: 0.28rem;
        color: #333;
        // float: right;
        // margin-right: .2rem;
        margin-left: .8rem;
        margin-top: -.82rem;
      }
      .delivery_right {
        position: absolute;
        right: 0.3rem;
        top: 24%;
        margin-top: -0.15rem;
        width: 0.16rem;
        height: 0.3rem;
        background: url(../../assets/btn-right.png) no-repeat;
        background-size: 100% 100%;
      }
      .delivery_input {
        background: #fff;
        font-size: 0.28rem;
        color: #333;
        margin-left: .8rem;
        border: none;
        margin-top: -.62rem;
      }
    }
  .comment-display{
    .for_comment {
        padding: 0 0.5rem 0 0.2rem;
        min-height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0.3rem;
        color: #777;
        position: relative;
        background: #fff;
        border-top: 1px solid #f1f1f1;
        .coupon_title {
          font-size: .26rem;
          color: #777;
        }
        .coupon_number {
          float:right;
          padding-right: .2rem; 
          font-size: .26rem;
        }
        .btn-right {
          position: absolute;
          right: 0.3rem;
          top: 50%;
          margin-top: -0.15rem;
          width: 0.16rem;
          height: 0.3rem;
          background: url(../../assets/btn-right.png) no-repeat;
          background-size: 100% 100%;
        }
      }
    .center{
        text-align: center;
        // height: 3rem;
        // line-height: 10rem;
        font-size: .26rem;
    }
    .list-com{
        height:1rem;
        font-size:.24rem;
        color:#333;
        display: -webkit-box;
        overflow: hidden;
        white-space: normal!important;
        text-overflow: ellipsis;
        word-wrap: break-word;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
    .list-wrap{
      width:7.1rem;
      padding:0 .2rem;
      height:3.5rem;
      background:#fff;
      margin-bottom:.1rem;
      .list-hd{
          padding:.2rem 0;
          line-height:.32rem;
          height:.3rem;
          display: flex;
          .pull-left{
              padding-left:.46rem;
              font-size:.2rem;
              color:#b0b0b0;
              position:relative;
              img{
                  width:.32rem;
                  height:.32rem;
                  position:absolute;
                  left:0;
                  top:0;
              }
          }
          .pull-right{
              color:#999;
              font-size:.26rem;
              padding: 0 0 0 .2rem;
              img{
                  width: 30/100rem
              }
          }
      }
      .list-purTimer{
          font-size:.21rem;
          color:#999;
          margin: -.5rem 0 .3rem 4.9rem;
      }
      .list-img-main{
          height:1rem;
          width: 18%;
          float: left;
          img{
              width:1rem;
              height:1rem;
              margin-right:.2rem;
              transform: scale(1);            /*图片原始大小1倍*/
              transition: all ease 0.5s;      /*图片放大所用时间*/
          }
          img.active {
              transform: scale(5);          /*图片需要放大3倍*/
              position: absolute;           /*是相对于前面的容器定位的，此处要放大的图片，不能使用position：relative；以及float，否则会导致z-index无效*/
              z-index: 100;
              margin-left: 3rem;
          }
      }
    }
  }

    .for_coupon {
      padding: 0 0.5rem 0 0.2rem;
      min-height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.3rem;
      color: #777;
      position: relative;
      background: #fff;
      border-top: 1px solid #f1f1f1;
      .coupon_title {
        font-size: .26rem;
        color: #777;
      }
      .coupon_number {
        float:right;
        padding-right: .2rem; 
        font-size: .26rem;
      }
      .btn-right {
        position: absolute;
        right: 0.3rem;
        top: 50%;
        margin-top: -0.15rem;
        width: 0.16rem;
        height: 0.3rem;
        background: url(../../assets/btn-right.png) no-repeat;
        background-size: 100% 100%;
      }
    }
    .ans_display{
    .for_ans {
      padding: 0 0.5rem 0 0.2rem;
      min-height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.3rem;
      color: #777;
      position: relative;
      background: #fff;
      border-top: 1px solid #f1f1f1;
      .ans_title {
        font-size: .26rem;
        color: #777;
      }
      .ans_number {
        float:right;
        padding-right: .2rem; 
        font-size: .26rem;
      }
      .btn-right {
        position: absolute;
        right: 0.3rem;
        top: 50%;
        margin-top: -0.15rem;
        width: 0.16rem;
        height: 0.3rem;
      background: url(../../assets/btn-right.png) no-repeat;
        background-size: 100% 100%;
      }
    }
      .product_li{
              background-color: #fff;
              padding:10/100rem 20/100rem;
              margin-bottom: .2rem;
              margin-top: -0.8rem;
              .use_area_head{
                  margin-bottom: .18rem;
                  height: .7rem;
                  line-height: .7rem;
                  color: #666;
                  font-size: .24rem;
                  em{
                      font-style: normal;
                  }
                  .g_ask_time{
                      color:#666;
                      font-size:.24rem;
                  }
              }
              .pro{
                  font-weight: 700;
                  margin-bottom:.05rem;
                  span{
                      background-color: #CA9B27;
                      
                  }
              }
              .color_grey{
                  color: #999;
              }
              p{
                  color: #333;
                  font-size: .32rem;
                  margin-bottom:.1rem;
                  font-size: 32/100rem;
                  line-height: 65/100rem;
              }
              .g_icon{
                  font-size: 28/100rem;
                  padding: 6/100rem;
                  border-radius: 5/100rem;
                  color:#fff;
                  background-color: #97CD93;
              }
              .yigong{
                    width: 2rem;
                    float: right;
                    margin-top: -0.55rem;
                    margin-right: -0.7rem;
              }
              .g_look_more{
                  font-size:.24rem;
                  color:#3985ff;
                  text-align:right;
              }
              .g_look_more::after {
                  content: "";
                  display: block;
                  width: 8px;
                  height: 8px;
                  border-top: 1px solid #3985ff;
                  border-left: 1px solid #3985ff;
                  -webkit-transform-origin: 50%;
                  transform-origin: 50%;
                  -webkit-transform: rotate(135deg);
                  transform: rotate(135deg);
                  margin: -2px 0 0 5px;
                  display: inline-block;
                  vertical-align: middle;
              }
          }

  }
    .mint-swipe {
      height: 7.75rem;
      .mint-swipe-items-wrap {
        div {
          width: 100%;
          height: 7.75rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .prompt {
      width: 100%;
      height: 0.9rem;
      background: #f1f1f1;
      line-height: 0.9rem;
      text-align: center;
      font-size: 0.26rem;
      color: #999;
    }

    #popup {
      width: 7rem;
      padding: 0.5rem 0.5rem 0.2rem;
      background: rgba(0, 0, 0, 0.5);
      ul {
        overflow: hidden;
        border-bottom: 1px solid #dfe3e4;
        background: #fff;
        border-radius: 0.6rem;
        padding: 0.2rem;
        li {
          float: left;
          margin: 0.1rem;
          width: 0.8rem;
          text-align: center;
        }
        img {
          width: 0.8rem;
          height: 0.8rem;
        }
      }
      button {
        display: block;
        width: 100%;
        text-align: center;
        margin-top: 0.2rem;
        background: #fff;
        line-height: 0.8rem;
        border-radius: 0.6rem;
        border: none;
      }
    }
</style>


<!-- 
https://developpaper.com/vue-uses-wechat-js-sdk-to-realize-sharing-function/
https://blog.csdn.net/Mangojjx/article/details/89354235 
https://www.programmersought.com/article/70683603065/
-->
