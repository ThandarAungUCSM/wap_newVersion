<template>
  <div class="home" ref="home">
    <div v-title data-title="主页">主页</div>
    <!-- <home-header :userName="getData"></home-header> -->
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
        <mt-swipe :auto="3000">
          <mt-swipe-item v-for="item in homeBanner.slice(0,8)" :key="item.id">
            <img class="home-banner-img" :src="URL + item.pic_url" @click="goAd(item.ad_link)" />
          </mt-swipe-item>
        </mt-swipe>

    <!-- 快捷链接加快讯 -->
    <news-flash
      :nav="$store.state.home_data.nav"
      :data="$store.state.home_data.announcement"
      @hit="hit"
    ></news-flash>

    <div class="various-lists">
      <div
          class="list"
          v-for="(item,index) in goodsType"
          :key="index"
          @click="toProductList(item)"
      >
        <div class="title">{{item.name}}</div>
        <div class="subtitle">{{item.describe}}</div>
        <div class="img-list">
            <img v-for="items in item.goods" :key="items.id" :src="URL + items.pic_url" alt />
        </div>
      </div>
    </div>

    <!-- 店铺街 -->
    <!--<limited-hd :text="$store.state.home_data.recommendGoods"></limited-hd>-->
    <div class="recomment-shop">
      <img src="../../assets/shoptitleimg.png" class="recomment-titleimg"/>
      <div class="recomment-title">优选门店</div>
      <img :src="URL + advertiseData.content" class="recomment-logo" @click="goLogoLink(advertiseData.ad_link)"/>
      <div class="advertise-all">
        <div class="advertise-card" v-for="item in advdata.slice(0,3)" :key="item.id">
          <img :src="URL + item.pic_url" class="advertise-img" @click="goLink(item.ad_link)"/>
        </div>
      </div>
    </div>

    <div class="shop-card" v-for="item in shoplist.slice(0,4)" :key="item.id">
      <div class="up-card">
        <img src="../../assets/recommentimg.png" class="up-bgimg"/>
        <img src="../../assets/recommentup.png" class="up-recomimg"/>
        <div class="up-activity">活动大促</div>
        <div class="add-new">
          <div class="shopup">
            <img class="shopup-img" :src="URL + item.store_logo" @click="shopHome(item.id)" />
            <div class="shopup-store">
              <div class="shopup-grad">
                <div class="shopup-title" @click="shopHome(item.id)">{{item.shop_name}}</div>
                <el-dropdown v-if="item.store_grade_name">
                  <span class="shop-gradename">{{item.store_grade_name}}</span>
                  <el-dropdown-menu slot="dropdown" v-if="item.classification">
                    <el-dropdown-item>{{item.classification}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="shopup-btn">
                <div class="shopup-pro">满减</div>
                <div class="shopup-dis">满减</div>
              </div>
            </div> 
          </div>
          <div class="shop-meter">2.7km</div>
        </div>
      </div>
      <div class="under-card">
        <div class="shop-description">
          <div class="store-name">月销&nbsp;{{item.store_sales}}</div>
          <div class="store-type">{{item.store_state}}</div>
          <!-- <img src="../../assets/starrecom.png" class="store-img"/>
          <img src="../../assets/starrecom.png" class="store-img"/>
          <img src="../../assets/starrecom.png" class="store-img"/>
          <img src="../../assets/starrecom.png" class="store-img"/>
          <img src="../../assets/images/xinxin.png" class="store-img"/> -->
          <img v-for = 'n in parseInt(item.Rating)' :key = 'n' :src="imgYes" class="store-img">
          <img v-for = 'n in 5-parseInt(item.Rating)' :key ="n + 'i'" :src="imgNo" class="store-img">
          <div class="store-star">{{item.Rating}}</div>
        </div>
        <div class="shop-show">
          <div class="shop-detail" v-for="val in item.store_goods.slice(0,3)" :key="val.id" @click="goproduct(val)">
            <img :src="URL + val.pic_url" class="show-img"/>
            <div class="show-title">{{val.title}}</div>
            <div class="show-price">￥{{val.goods_price}}</div>
          </div>
        </div>
      </div>
    </div>

    <ul class="floor">
      <li class="floor-item" v-for="(item,index) in floorList" :key="index">
        <div class="top">
          <div class="title fl">{{item.class.class_name}}</div>
          <span @click="more(item)" class="more fr">
            更多
            <em>
              <i></i>
              <b></b>
            </em>
          </span>
        </div>
        <div class="image-ad" @click="goAd(item.ad.ad_link)">
          <img v-if="item.ad" :src="URL+item.ad.pic_url" />
        </div>
        <div class="goods-box">
          <div
            v-show="item.goods"
            :key="ing"
            class="floor-goods"
            v-for="(i,ing) in item.goods"
            @click="enterDetail(i)"
          >
            <img v-lazy="URL+i.pic_url"/>
            <p class="title">
              <span class="shop-grade" v-if="i.store_grade_name">{{i.store_grade_name}}</span>
              {{i.title}}
            </p>
            <div class="showdiv">
               <!-- && (parseInt(i.price)>=parseInt(i.couponCondition[0].condition)) -->
              <p class="couponshow" v-if="i.couponCondition && i.couponCondition[0] && i.couponCondition[0].condition"> 满{{parseInt(i.couponCondition[0].condition)}}减{{parseInt(i.couponCondition[0].money)}}元</p>
              <p class="discountshow" v-if="i.goodsPromotion">满减</p>
              <p class="discountshow" v-if="i.goodsPromotion">满赠</p>
            </div>
            <p class="price">￥{{i.price}}</p>
          </div>
        </div>
      </li>
    </ul>
    <span class="isEnd" v-if="isEnd">加载完毕</span>
    <span
      v-else
      v-loading="floorLoading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
      class="isEnd"
    ></span>
    <Shopsn></Shopsn>
    <div class="load-wrap" v-show="$store.state.load_wrap" @touchmove.prevent>
      <mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
    </div>
    <to-Top></to-Top>
  </div>
</template>
<script>
import HomeHeader from "./children/header.vue"; //头部内容
import NewsFlash from "./children/newsFlash"; //快捷链接加快讯
import limitedHd from "./children/conHeader"; // 内容头
import hotGoods from "./children/hotGoods"; // 内容列表
import Shopsn from "@/components/page/Shopsn.vue"; //列表底部内容
import limitedActivity from "./children/limitedActivity";
import limitedDd from "@/components/Widget/moveCon";
import brandMus from "./children/BrandMus";
import lateMall from "./children/lateMall";
import mallCon from "@/components/Widget/mallCon";
import toTop from "@/components/page/toTop"; //回到顶部
import { Indicator, Toast, MessageBox, Popup } from "mint-ui";
import QS from "qs";
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: "home",
  data() {
    return {
      imgNo:require('@/assets/images/xinxin.png'),
      imgYes:require('@/assets/starrecom.png'),
      continuous: true,
      defaultIndex: 0,
      showIndicators: true,
      prevent: true,
      stopPropagation: true,
      data: "",
      getData: "",
      newsData: null,
      endtime: "",
      promotions: [],
      currentPage: 1,
      floorList: [],
      isBottom: false,
      adList: [],
      isEnd: false,
      floorLoading: false,
      isRepeat: false,
      homeBanner:'',
      seekImg:require('@/assets/images/sousuo@2x.png'),
      RichScan:require('@/assets/images/RichScan.png'),
      advices:require('@/assets/images/advices.png'),
      advimg:'',
      advdata:'',
      advertiseData:'',
      sort_types:'store_sort',
      shoplist:[],
      goodsType: [],
    };
  },
  computed: {
    // ...mapState(['testing'])
    // ...mapGetters(['getEventById', 'catLength'])
  },
  created() {
    var userName = this.$route.params.userName;
    this.getData = userName;
    this.axios({
      url: this.$httpConfig.home,
      method: "post"
    })
      .then(res => {
        var json_wx = JSON.parse(res.request.response);
        Toast(res.data.message);
        if (json_wx.status == 999) {
          window.location.href = json_wx.msg;
          return;
        }
        this.$store.state.home_data = res.data.data;
        this.homeBanner = res.data.data.banner;
      })
      .catch(err => {
        console.log(err);
      });

      // this.getgoodInfo();
      this.advertise();
      this.getStoreListAjax();
      this.getGoodsType();
  },
  
  mounted() {

    this.getFloor();
    var that = this;
    setTimeout(that.getFloor, 800); //首次进入时请求两次，防止iPhoneX不能铺满屏
    $(window).scroll(function() {
      if (!that.$refs.home) return;
      var bot = 700;
      if ($(".floor").length) {
        if (
          that.isBottom == false &&
          bot + $(window).scrollTop() >= 310 + $(".floor")[0].clientHeight
        ) {
          that.isBottom = true;
          if (!this.isEnd) {
            that.getFloor();
          }
        }
      }
    });
    $("html,body").animate({ scrollTop: "0px" }, 300);
  },
  methods: {
    getGoodsType() {
        this.axios
            .post(this.$httpConfig.goodsType)
            .then(res => {
                if (res.data.status == 1) {
                    this.goodsType = res.data.data;
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
    toProductList(item) {
      this.$router.push({
          name: "productList",
          params: {
              id: item.id,
              name: item.name
          }
      });
    },
    shopHome(id){
      this.$router.push({
        name:"shopHome",
        params:{
          id:id,
          index:0
        }
      })
    },
    goproduct(goods){
      this.$router.push({
          name:"product",
          params:{
              id:goods.id,
              status: 1
          }
      })
    },
    goLink(shopAdvertise){
      window.open(shopAdvertise);
    },
    goLogoLink(logoAdvertise){
      window.open(logoAdvertise);
    },
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
    },
    goAd(address) {
      window.open(address);
    },
    getFloor() {
      if (this.isRepeat && this.currentPage == 1) {
        return false;
      } else {
        if (this.currentPage == 1) {
          this.isRepeat = true;
        }
        this.floorLoading = true;
        var params = { page: this.currentPage };
        this.$HTTP(this.$httpConfig.indexFloor, params, "post")
          .then(res => {
            this.floorList.push(res.data.data);
            // console.log(JSON.stringify(this.floorList))
            // [i].goods.id
            this.getGoodfInfo()
            this.currentPage++;
            this.isBottom = false;
            this.isEnd = false;

            this.coupon = res.data.data.goods;
            for (let i in this.coupon) {
            this.$store.state.showcoupondetail = res.data.data.goods[i].id;
            // this.getgoodInfo();
            }
        
            // this.getAd();
          })
          .catch(err => {
            if (err.data.status == 0) {
              this.isEnd = true;
            }
          });
      }
    },
    getAd() {
      this.$HTTP(
        this.$httpConfig.getAd,
        { page: this.currentPage - 1 },
        "post"
      ).then(res => {
        this.adList.push(res.data.data);
        this.floorLoading = true;
      });
    },
    getGoodfInfo() {
      // console.log(JSON.stringify(this.floorList))
      // console.log(this.floorList.length)
      // [i].goods.id
      let tempFloor = this.floorList
      let tempResult = tempFloor.map(f => {
          if(f && f.goods){
              let fgood = f.goods.map(n => {
                  // console.log('good luck1 ' + JSON.stringify(n.id))
                  this.axios({
                      url: this.$httpConfig.goodInfo,
                      method: "get",
                      params: {
                          id: n.id
                      }
                  })
                  .then(res => {
                      let nn = n.id
                      let tt = res.data.data.promotion.length
                      this.$store.state.commodity_data = res.data.data;
                      
                      // this.promotion = res.data.data.promotion;
                      
                      if(tt !== 0 || res.data.data.promotion.prom_id) {
                          // console.log('ssssssss ' + JSON.stringify(res.data.data.promotion))
                          let result = tempFloor.map(ff => {
                              if(ff && ff.goods) {
                                  let resultGood = ff.goods.map(n1 => {
                                      if(n1.goods_id == res.data.data.goods.id) {
                                          // console.log('hello ' + JSON.stringify(n1))
                                          let arr = []
                                          arr.push(res.data.data.promotion)
                                          n1["goodsPromotion"] = res.data.data.promotion
                                          return n1;
                                      }
                                  })
                                  return ff;
                              }
                          })
                          this.floorList = []
                          this.floorList = result
                      }
                      
                      
                      // this.promotion_id = res.data.data.promotion.goods_id;
                      this.CouponSendList(nn)
                  })
                  .catch(err => {
                      console.log(err);
                  })
              })
          } 
      })
        
    },
    more(goods) {
      this.$router.push({
        name: "listHomeMore",
        params: {
          status: goods.class.id
        }
      });
    },
    hit(id) {
      this.$router.push({
        name: "noticeChild",
        params: {
          id: id
        }
      });
    },
    enterDetail(goods) {
      this.$router.push({
        name: "product",
        params: {
          id: goods.id,
          status: 1
        }
      });

    },
    CouponSendList(nn) {
        // console.log("Coupon " + this.$store.state.commodity_data.goods.store_id)
        this.axios({
            url: this.$httpConfig.CouponSendList,
            method: "get",
            params: {
                store_id: this.$store.state.commodity_data.goods.store_id
            }
        })
        .then(res => {
            // console.log('Coupon Result  ' + JSON.stringify(res.data.data.records))

            var tempResult = this.floorList.map(f => {
                if(f && f.goods){
                    let fgood = f.goods.map(n => {
                        if(n.id && nn)  {
                            let result = res.data.data.records
                            result.sort(function(a, b){return b.condition-a.condition})
                            
                            let smallcount = 0
                            for(let i = 0; i < result.length; i++) {
                                if(parseInt(n.price) > parseInt(result[i].condition)) {
                                    
                                    if(i == 0) {
                                        break
                                    } else {
                                        let te = result[i]
                                        let tem = result[0]
                                        result[i] = tem
                                        result[0] = te
                                        break
                                    }   
                                    
                                } else {
                                  smallcount++
                                }
                            }
                            if(smallcount == result.length) {
                                let te = result[result.length-1]
                                let tem = result[0]
                                result[result.length-1] = tem
                                result[0] = te
                            }
                            let answer = result
                            // console.log(n.price + ' ' + JSON.stringify(result))
                            n['couponCondition'] = answer
                            
                            return n;
                        }
                    })
                    return f;
                } 
            })
            
            if(tempResult) {
              this.floorList = []
              this.floorList = tempResult
            }
            // console.log("Good Result " + JSON.stringify(this.floorList))
            
        })
        .catch(err => {
            console.log(err);
        });
    },
    advertise(){
      this.axios.post(this.$httpConfig.advertise).
        then((res) => {
          this.advertiseData = res.data.data;
          this.advdata = res.data.data.data;
        }).catch((err) => {
          console.log(err);
        })
    },
    getStoreListAjax() {
      this.axios.post(this.$httpConfig.getStoreList, QS.stringify({
        page:1,
        sort_types:this.sort_types,
        class_id:this.class_id,
        address_id:this.address_id
      })).then((res) => {
        this.shoplist =res.data.data.records;
      }).catch((err) => {
        console.log(err)
      });
    },
  },
  destroyed() {},
  updated() {
    var that = this;
    setTimeout(function() {
      that.$store.state.load_wrap = false;
    }, 1000);
  },
  components: {
    HomeHeader,
    NewsFlash,
    limitedActivity,
    hotGoods,
    Shopsn,
    limitedDd,
    limitedHd,
    brandMus,
    lateMall,
    mallCon,
    toTop
  }
};
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
  margin: .05rem 0 0 0;
}
.el-dropdown-menu {
    /* width: 230px !important; */
    position: absolute !important;
    margin: .1rem -1rem 0 0 !important;
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
<style>
.home-banner-img {
  background-size: 100%;
}
.el-loading-spinner i {
  color: #999 !important;
}
.el-loading-spinner .el-loading-text {
  color: #999 !important;
}
.el-loading-mask {
  background: none;
  color: #999 !important;
}
</style>

<style lang="less" scoped>
    .header{
        // width: 7.5rem;
        // height: 0.9rem;
        // background-color: #d02629;
        // position: relative;
        // overflow: hidden;
            width: 100%;
            height: 2.5rem;
            position: relative;
            overflow: hidden;
            background: linear-gradient(#fcf1e9, #F50101);
            border-radius: 0 0 0.2rem 0.2rem;
        .header_logo{
            position: absolute;    
            left: 0;
            top: 0;
            width: 1.85rem;
            height: 0.9rem;
            display: block;
            background-image: url("../../assets/images/logo.png");
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
                border: 0.01rem solid #ffffff;
                outline: none;
                font-size: 0.26rem;
                text-indent: 0.75rem;
                background-color: #ffffff;
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
                color: #999;
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
.home {
  .to-top {
    position: fixed;
    width: 0.75rem;
    height: 0.75rem;
    bottom: 1.6rem;
    right: 0.2rem;
  }
  .mint-swipe-indicators {
    width: 100%;
    text-align: center;
  }
  .various-lists {
    padding: 2%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .list {
        padding-top: 0.3rem;
        border-radius: 0.2rem;
        width: 49%;
        padding-bottom: 0.2rem;
        background: #ffffff;
        margin-bottom: 0.2rem;

        .title {
            padding-left: 0.2rem;
            height: 0.25rem;
            border-left: 0.05rem solid #b49d76;
            font-size: 0.3rem;
            line-height: 0.25rem;
            font-weight: bold;
        }

        .subtitle {
            font-size: 0.26rem;
            padding-left: 0.25rem;
            color: #999999;
            margin-top: 0.05rem;
        }

        .img-list {
            display: flex;
            align-items: center;

            img {
                width: 1.2rem;
                height: 1.2rem;
                margin-left: 0.3rem;
                margin-top: 0.1rem;
            }
        }
    }
  }
  .recomment-shop{
    margin-top: .2rem;
    padding: .3rem 0 .3rem 0;
    background-color: #ffffff;
    width: 100%;
    .recomment-titleimg{
      width: 3rem;
      margin: 0 0 0 2.2rem;
    }
    .recomment-title{
      font-size: .32rem;
      margin: -.33rem 0 0 0;
      text-align: center;
    }
    .recomment-logo{
      width: 95%;
      height: auto;
      margin: .3rem 0 0 .16rem;
    }
    .advertise-all{
      display: flex;
      .advertise-card{
        width: 2.47rem;
        border-right: .03rem solid #f1f1f1;
        .advertise-title{
          font-size: .26rem;
          text-align: center;
          margin: .15rem 0 0 0;
        }
        .advertise-detail{
          font-size: .26rem;
          text-align: center;
          margin: .15rem 0 0 0;
        }
        .advertise-img{
          width: 1.8rem;
          height: 2.5rem;
          margin: .15rem .35rem .2rem .35rem;
        }
      }
    }
  }
  .shop-card{
    background-color: #ffffff;
    margin: .3rem .15rem .3rem .15rem;
    border-radius: .2rem;
    .up-card{
      // background-color: #da3632;
      .up-bgimg{
        width: 100%;
        height: 1.5rem;
      }
      .up-recomimg{
        width: .65rem;
        height: .65rem;
        margin: -1.5rem 0 0 6.2rem;
      }
      .up-activity{
        font-size: .18rem;
        margin: -1.5rem 0 0 6.34rem;
        color: white;
        width: .5rem;
      }
      .add-new{
        display: flex;
        .shopup{
          display: flex;
          margin: .2rem .2rem .2rem .2rem;
          width: 80%;
          .shopup-img{
            width: 1rem;
            height: 1rem;
            border-radius: .1rem;
          }
          .shopup-store{
            margin: .03rem 0 0 .2rem;
            .shopup-grad{
              display: flex;
              .shopup-title{
                font-size: .3rem;
                color: white;
              }
              .shop-gradename{
                font-size: .23rem;
                background: #de2d35;
                color: white;
                border-radius: .05rem;
                padding: .05rem .1rem;
                text-align: center;
                margin: 0 0 0 .2rem;
              }
            }
            .shopup-btn{
              display: flex;
              .shopup-pro{
                font-size: .23rem;
                padding: .01rem .2rem .05rem .2rem;
                background: #EC7043;
                margin: .2rem .2rem 0 0;
                color: white;
                height: .3rem;
                border-radius: .05rem;
              }
              .shopup-dis{
                font-size: .23rem;
                padding: .01rem .2rem .05rem .2rem;
                background: #E8BF54;
                margin: .2rem .2rem 0 0;
                color: white;
                height: .3rem;
                border-radius: .05rem;
              }
            }
          }
        }
        .shop-meter{
          font-size: .28rem;
          color: white;
          margin: .5rem 0 0 0;
        }
    }
    }
    .under-card{
      .shop-description{
        display: flex;
        padding: .1rem .2rem .2rem .2rem;
        .store-name{
          font-size: .28rem;
          padding: 0 .2rem 0 0;
          border-right: .02rem solid #999;
          width: 1.3rem;
        }
        .store-type{
          font-size: .28rem;
          padding: 0 0 0 .2rem;
          color: #999;
          width: 3.5rem;
        }
        .store-img{
          width: .3rem;
          height: .3rem;
          padding: 0 .05rem;
        }
        .store-star{
          color: #EC6D2D;
          padding: 0 0 0 .1rem;
        }
      }
      .shop-show{
        display: flex;
        .shop-detail{
          padding: .2rem;
          .show-img{
            width: 2rem;
          }
          .show-title{
            font-size: .23rem;
            width: 2rem;
            line-height: .5rem;
          }
          .show-price{
            font-size: .23rem;
            color:#FF7900;
          }
        }
      }
    }
  }
  .floor {
    background-color: #f2f1f2;
    box-sizing: border-box;
    .floor-item {
      background-color: #f2f1f2;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .top {
        background-color: #f2f1f2;
        width: 100%;
        padding: 0.2rem;
        overflow: hidden;
        .title {
          border-left: 3px solid #d02629;
          padding-left: 0.2rem;
          font-size: 0.32rem;
          color: #111111;
        }
        .more {
          line-height: 0.4rem;
          color: #999;
          font-size: 0.28rem;
          position: relative;
          padding-right: 0.2rem;
          em {
            position: absolute;
            right: 0;
            top: 0.07rem;
            i {
              border-left: 6px solid #ccc;
              border-top: 6px solid transparent;
              border-bottom: 6px solid transparent;
              position: absolute;
              right: -0.04rem;
              top: 0;
            }
            b {
              border-left: 6px solid #f2f2f2;
              border-top: 6px solid transparent;
              border-bottom: 6px solid transparent;
              position: absolute;
              right: 0;
              top: 0;
            }
          }
        }
      }
      .image-ad {
        width: 7.45rem;
        height: 3.5rem;
        border: 1px solid #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 100%;
          height: 4rem;
          border: none;
        }
      }
      .goods-box {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        .floor-goods {
          margin-top: 2%;
          background-color: #fff;
          width: 49%;
          float: left;
          // border: 3px solid #F2F1F2;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          img {
            width: 100%;
            height: 3.5rem;
            align-self: center;
            border-bottom: 0.5px solid #f2f1f2;
          }
          .title {
            display: -webkit-box;
            overflow: hidden;
            white-space: normal !important;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            color: #343434;
            height: 40px;
            line-height: 20px;
            text-align: left;
            padding: 0 0.2rem;
            font-size: 14px;
            margin-top: .1rem;
              .shop-grade{
                font-size: .22rem;
                background: #de2d35;
                color: white;
                border-radius: .05rem;
                padding: .05rem .1rem;
                text-align: center;
              }
          }
          .showdiv{
            display: flex;
            padding: .01rem .2rem;
            .couponshow{
              background: url(../../assets/showcoupon.png) no-repeat;
              background-size: 100% 100%;
              font-size: .2rem;
              padding: .25em .1rem 0 .1rem;
              // height: .25rem;
              margin: .06rem .07rem 0 0;
              color: #fff;
            }
            .discountshow{
              color: #da3632;
              border: 1px solid #da3632;
              height: .21rem;
              padding: .04rem .02rem .02rem .02rem;
              font-size: .18rem;
              margin: .05rem .07rem 0 .02rem;
            }
        }
        .price {
          color: #da3632;
          font-size: 15px;
          font-weight: bold;
          text-align: left;
          padding: 0 0.2rem;
          height: 30px;
          line-height: 25px;
      }
      }
    }
  }
  }
  .isEnd {
    display: flex;
    width: 100%;
    justify-content: center;
    height: 50px;
    align-items: center;
    color: #999;
  }
}
</style>
<style lang="less" scoped>
.home {
  .mint-swipe {
    // width: 100%;
    // height: 3.28rem;
      width: 90%;
      text-align: center;
      position: absolute;
      left: 5%;
      top: 1.2rem;
      border-radius: 0.2rem;
      height: 3.28rem;
      z-index: 10;
    img {
      width: 100%;
      height: 100%;
    }
    .mint-swipe-indicators {
      .mint-swipe-indicator {
        width: 20px;
        height: 20px;
      }
    }
  }
  .entranch-main {
    width: 100%;
    height: 2rem;
  }
  .home-banner {
    padding: 0.2rem;
    img {
      width: 100%;
    }
  }
  .banner {
    img {
      width: 100%;
    }
  }
  .banner-3 {
    img {
      width: 7.5rem;
      height: 3.75rem;
    }
  }
  .limit-banner {
    padding: 0.2rem;
    img {
      width: 7.1rem;
      height: 1.66rem;
      border-radius: 5px;
    }
  }
}
</style>