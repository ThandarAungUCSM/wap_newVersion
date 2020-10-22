<template>
    <div class="auction-list">
        <header-co :text="title"></header-co>
        <mt-swipe :auto="4000">
            <mt-swipe-item v-for="item in datas" :key="item.id">
                <img :src="URL + item">
            </mt-swipe-item>
        </mt-swipe>
        <div class="introduce">
            <p class="l big">{{detail.title}}</p>
            <!--<p class="l share">
                <span class="pic"><img src="../../assets/images/Share.png"/></span>
                <span class="font">分享</span>
            </p>-->
            <p class="chase l"> 抢购剩余时间：
                <span>{{day}}</span>天<span>{{hour}}</span>小时<span>{{Minute}}</span>分钟<span>{{second}}</span>秒
            </p>
            <p class="money l"><span>￥</span>{{detail.panic_price}}</p>
        </div>

        <!-- 店铺 -->
        <shop-infor :shopData="shopData"></shop-infor>
        <!--<div class="choose">-->
        <!--<div class="promote">-->
        <!--<p class="top">-->
        <!--<span class="l text">促销</span>-->
        <!--<span class="l"><img src="../../assets/manzeng.png"/></span>-->
        <!--<span class="l">购买￥200.00，赠精美包装礼盒</span>-->
        <!--</p>-->
        <!--<p class="bottom">-->
        <!--<span class="l"><img src="../../assets/manjain.png"/></span>-->
        <!--<span class="l">单笔订单满￥88.00.立减￥20.00</span>-->
        <!--</p>-->
        <!--</div>-->
        <!--&lt;!&ndash;<div class="already">&ndash;&gt;-->
        <!--&lt;!&ndash;<p><span class="one">已选</span><span class="two">颜色：白玉，数量1</span><span&ndash;&gt;-->
        <!--&lt;!&ndash;class="r el-icon-arrow-right three"></span></p>&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--</div>-->
        <pr-list
                v-if="$store.state.dataLeave.length != 0 || $store.state.dataLeave.length"
                :conItem="conItem"
                :val="2"
                :data="$store.state.dataLeave"
        ></pr-list>

        <div @click="toTab" class="contine">
            <p>点击查看更多商品信息</p>
        </div>
        <!--<div class="navs">-->
            <!--<ul>-->
                <!--<li v-for="(one,index) in data" class="l" :class="{active:isactive==index}" @click="pull(index)"-->
                    <!--:key="index">{{one}}-->
                <!--</li>-->
            <!--</ul>-->
        <!--</div>-->
        <!--<div class="contain" v-show="name">-->

        <!--</div>-->

        <mt-tabbar class="boxing" fixed>
            <!--<div class="collect" @click="collect">-->
                <!--<img :src="imgsNo" alt v-if="type==2" />-->
                <!--<img v-else :src="imgsYes" alt />-->
            <!--</div>-->
            <p @click="panic" class="buy button">立即抢购</p>
        </mt-tabbar>
    </div>
</template>

<script>
    import headerCo from '@/components/page/children/shop_header.vue'; //头部内容
    import prList from "@/components/page/children/list.vue"; //猜你喜欢和搭配套餐
    import shopInfor from "@/components/page/children/shopInfor.vue"; // 店铺信息
    import {Indicator, Toast} from 'mint-ui';
    import qs from 'qs';
    import QS from 'qs';
    import imgage from "@/assets/bgyj.jpg"
    import brand from "@/assets/loop.png"

    export default {
        data() {

            return {
                title: '商品详情',
                datas: [],
                hello: [
                    {img: brand, text: "和玉缘 和田玉白玉路路通转运珠吊坠...", price: "￥188.00"},
                    {img: brand, text: "和玉缘 和田玉白玉路路通转运珠吊坠...", price: "￥10.99"},
                    {img: brand, text: "和玉缘 和田玉白玉路路通转运珠吊坠...", price: "￥10.99"},
                ],
                data: ["图文详情", "规格参数", "商品评论", "商品咨询"],
                name: true,
                isactive: "",
                detail:"",
                imgsNo: require("@/assets/images/footer_star.png"),
                imgsYes: require("@/assets/images/star_angle.png"),
                sort: "收藏",
                day: '',
                hour: '',
                Minute: '',
                second: '',
                conItem: {
                    title: "猜你喜欢"
                },
                shopData: "",
                page: 1,
                dataLeave: '',
                type:'',
                currentTimeStamp:''
            }
        },
        mounted() {
            var now = new Date();
            this.currentTimeStamp = now.getTime();
            this.getDetail();
            this.myLove();
        },
        methods: {
            getDetail() {
                this.axios.post(this.$httpConfig.panicGoodsDetail, qs.stringify({
                    goods_id: this.$route.params.goods_id
                })).then((res) => {
                    if (res.data.status == 1) {
                        this.datas = res.data.data.img;
                        this.detail = res.data.data;
                        this.computationTime(res.data.data.end_time);
                        this.shopInfo(res.data.data.store_id)
                    }
                })
            },
            toTab() {
                this.$router.push({
                    name: "tab",
                    params: {
                        id: this.$route.params.goods_id,
                        p_id: this.detail.p_id
                    }
                });
            },
            shopInfo(store_id) {
                this.axios({
                    url: this.$httpConfig.shopInfo,
                    method: "get",
                    params: {
                        id: store_id
                    }
                })
                    .then(res => {
                        this.shopData = res.data.data;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //计算倒计时或已开抢时间
            computationTime(timestamp) {
                let self = this;
                this.timer = setInterval(function() {
                    let t = null;
                    var now = new Date();
                    var now_Time = now.getTime();
                    t = timestamp*1000 - now_Time;
                    let day = Math.floor(t / 86400000);
                    let hour = Math.floor(t / 3600000)%24;
                    let min = Math.floor((t / 60000) % 60);
                    let sec = Math.floor((t / 1000) % 60);
                    day = day < 10 ? "0" + day : day;
                    hour = hour < 10 ? "0" + hour : hour;
                    min = min < 10 ? "0" + min : min;
                    sec = sec < 10 ? "0" + sec : sec;
                    self.day = `${day}`;
                    self.hour = `${hour}`;
                    self.Minute = `${min}`;
                    self.second = `${sec}`;
                }, 1000);
            },
            myLove() {
                this.axios
                    .post(this.$httpConfig.guessLove, qs.stringify({page: this.page}))
                    .then(res => {
                        this.$store.state.dataLeave = res.data.data;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            pull(index) {
                this.isactive = index
            },
            panic(){
                this.$router.push({
                    name: "confirmPanic",
                    params: {
                        good_id: this.detail.id,
                        num: 1,
                        sub_id: "commonGood",
                        id: 2
                    }
                });
            },
            collect() {
                //收藏
                if (this.type == 2) {
                    this.imgs = this.imgsYes;
                    this.type = 1;
                } else {
                    this.imgs = this.imgsNo;
                    this.type = 2;
                }
                this.axios
                    .post(
                        this.$httpConfig.addCollection,
                        qs.stringify({
                            goods_id: this.$route.params.goods_id,
                            type: this.type
                        })
                    )
                    .then(res => {
                        if (res.data.status == 10001) {
                            this.$router.push("/LogIn");
                        } else {
                            Toast({
                                message: res.data.message,
                                position: "bottom",
                                duration: 800
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        components: {
            headerCo,
            prList,
            shopInfor
        }
    }
</script>

<style lang="less" scoped>
    .auction-list{
        background: #ffffff;
        padding-bottom: 1rem;
    }

    .l {
        float: left;
    }

    .r {
        float: right;
    }

    .mint-swipe {
        width: 100%;
        height: 6.22rem;

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

    .introduce {
        width: 100%;
        height: 2.5rem;
        background: #f1f1f1;

        .big {
            width: 6.4rem;
            height: 1rem;
            font-size: 0.3rem;
            font-family: "微软雅黑";
            margin-top: .2rem;
            margin-left: .2rem;
            color: #323232;
            margin-right: 0.2rem;
            line-height: 155%;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .share {
            width: 0.6rem;
            margin-top: .2rem;
            margin-left: .1rem;
            height: 1rem;
            line-height: 200%;

            .pic {
                display: block;

                img {
                    width: 0.4rem;
                    height: 0.4rem;
                }
            }

            .font {
                color: #565656;
            }

        }

        .chase {
            width: 6rem;
            height: .4rem;
            line-height: .4rem;
            margin-left: .2rem;
            font-size: 0.2rem;
            color: #d29d29;
        }

        .money {
            width: 80%;
            height: 0.5rem;
            color: #df282a;
            font-size: .3rem;
            margin-left: .2rem;
            margin-top: .1rem;
        }
    }

    .choose {
        width: 100%;
        height: 3rem;
        background: #FFFFFF;

        .promote {
            width: 100%;
            height: 1.3rem;
            padding-top: .2rem;
            border-bottom: 1px solid #f1f1f1;

            .top {
                width: 100%;
                height: 0.75rem;
                line-height: 300%;

                .text {
                    margin-left: 0.2rem;
                    margin-right: .2rem;
                    font-size: .25rem;
                    color: #767676;
                }

                span {
                    display: inline-block;
                    font-size: .25rem;
                    color: #767676;
                }

                img {
                    margin-top: .16rem;
                    width: .75rem;
                    margin-right: .2rem;
                }
            }

            .bottom {
                width: 100%;
                height: 0.75rem;
                line-height: 200%;

                span {
                    display: inline-block;
                    font-size: .25rem;
                    color: #767676;
                }

                img {
                    margin-top: .05rem;
                    width: .75rem;
                    margin-right: .2rem;
                    margin-left: .9rem;
                }
            }

        }

        .already {
            width: 95%;
            height: 1.3rem;

            p {
                height: 1.3rem;
                line-height: 1.3rem;

                .one {
                    width: 15%;
                    display: inline-block;
                    margin-left: .2rem;
                    font-size: .25rem;
                    color: #777777;
                }

                .two {
                    display: inline-block;
                    margin-left: .2rem;
                    font-size: .3rem;
                    color: #333333;
                }

                .three {
                    display: inline-block;
                    line-height: 1.3rem;
                    font-size: .3rem;
                    color: #777777;
                }
            }
        }
    }


        .boxing {
            width: 100%;
            height: 1rem;
            display: flex;
            justify-content: space-between;

            .collect {
                width: 50%;
                height: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: 50/100rem;
                    height: 50/100rem;
                }
            }

            .join {
                width: 50%;
                height: 1rem;
                line-height: 1rem;
                text-align: center;
                background: #e9c440;
                color: #FFFFFF;
                font-size: 0.3rem;
            }

            .buy {
                width: 100%;
                height: 1rem;
                line-height: 1rem;
                text-align: center;
                background: #d02629;
                color: #FFFFFF;
                font-size: 0.3rem;
            }
        }

        .shop {
            width: 100%;
            height: 7rem;
            background: #FFFFFF;
            border-top: 1px solid #dfdfdf;
            margin-top: .2rem;

            .tops {
                width: 90%;
                margin-top: .4rem;
                margin-left: .3rem;
                height: 1.6rem;

                .boxs {
                    width: 1.5rem;
                    height: 1.5rem;
                    line-height: 1.5rem;
                    text-align: center;
                    vertical-align: middle;
                    border: 1px solid #dfdfdf;
                }

                .title {
                    display: block;
                    width: 3rem;
                    height: .9rem;
                    line-height: .9rem;
                    font-size: .4rem;
                    margin-left: .3rem;
                    color: #333333;
                }

                .people {
                    display: block;
                    width: 3rem;
                    font-size: .2rem;
                    margin-left: .3rem;
                    color: #999999;
                }
            }

            .middle {
                width: 100%;
                height: 2.8rem;

                ul {
                    width: 100%;
                    margin-top: .5rem;
                    height: 2.8rem;

                    li {
                        width: 30%;
                        height: 2rem;
                        line-height: 300%;
                        margin-top: .3rem;
                        border-right: 1px solid #dddddd;
                        text-align: center;

                        .number {
                            display: block;
                            margin-top: .3rem;
                            font-size: .3rem;
                        }

                        .numbers {
                            display: block;
                            font-size: .25rem;
                            color: #999999;
                        }

                        .cate {
                            height: .6rem;
                            line-height: .6rem;

                            .desc {
                                font-size: .24rem;
                                color: #999999;
                            }

                            .color {
                                font-size: .24rem;
                                color: #d2ae34;
                                margin-left: .1rem;
                            }
                        }
                    }
                }
            }

            .bottom {
                width: 100%;
                height: 1rem;

                .chat {
                    width: 1.5rem;
                    height: .6rem;
                    line-height: .6rem;
                    text-align: center;
                    border-radius: 10px;
                    border: 1px solid #d2ae34;
                    font-size: .25rem;
                    color: #d2ae34;
                    margin-left: 1.6rem;
                }

                .enter {
                    width: 1.5rem;
                    height: .6rem;
                    line-height: .6rem;
                    text-align: center;
                    border-radius: 10px;
                    border: 1px solid #d2ae34;
                    font-size: .25rem;
                    color: #d2ae34;
                    margin-left: .8rem;
                }
            }
        }

        .lunch {
            width: 100%;
            height: 6rem;
            margin-top: .2rem;
            background: #FFFFFF;

            .bott {
                width: 100%;
                height: 1rem;

                .lefts {
                    width: 3rem;
                    height: 1rem;
                    line-height: 1rem;
                    font-size: .3rem;
                    color: #333333;
                    margin-left: .2rem;
                }

                .rights {
                    width: .5rem;
                    height: 1rem;
                    line-height: 1rem;
                    font-size: .5rem;
                    color: #CCCCCC;
                }
            }

            .box {
                width: 100%;
                height: 4rem;

                dl {
                    width: 32%;
                    height: 4rem;

                    dt {
                        width: 2rem;
                        border: 1px solid #CCCCCC;
                        margin-left: .2rem;
                        height: 2.5rem;

                        img {
                            width: 2rem;
                            height: 2rem;
                            margin-top: .5rem;
                        }
                    }

                    dd {
                        width: 2rem;
                        height: 1rem;
                        margin-top: .2rem;
                        margin-left: .2rem;

                        .hello {
                            display: block;
                            color: #727274;
                            font-size: .18rem;
                        }

                        .price {
                            display: block;
                            color: #e02828;
                            font-size: .25rem;
                        }
                    }
                }
            }
        }

        .lunchs {
            width: 100%;
            height: 6rem;
            margin-top: .2rem;
            background: #FFFFFF;

            .bott {
                width: 100%;
                height: 1rem;

                .lefts {
                    width: 3rem;
                    height: 1rem;
                    line-height: 1rem;
                    font-size: .3rem;
                    color: #e12929;
                    margin-left: .2rem;
                }

                .rights {
                    width: 1rem;
                    height: 1rem;
                    line-height: 1rem;
                    font-size: .2rem;
                    color: #CCCCCC;
                }
            }

            .box {
                width: 100%;
                height: 4rem;

                dl {
                    width: 33%;
                    height: 4rem;

                    dt {
                        width: 2rem;
                        margin-left: .2rem;
                        height: 2.5rem;

                        img {
                            width: 2rem;
                            height: 2rem;
                            margin-top: .5rem;
                        }
                    }

                    dd {
                        width: 2rem;
                        height: 1rem;
                        margin-top: .2rem;
                        margin-left: .2rem;

                        .hello {
                            display: block;
                            color: #727274;
                            font-size: .18rem;
                        }

                        .price {
                            display: block;
                            color: #e02828;
                            font-size: .25rem;
                        }
                    }
                }
            }
        }


        .contine {
            width: 100%;
            height: 1rem;
            background: #f1f1f1;
            text-align: center;
            line-height: 1rem;

            p {
                height: 1rem;
                text-align: center;
                line-height: 1rem;
                color: #999999;
            }
        }

        .navs {
            width: 100%;
            height: 1rem;
            background: #FFFFFF;

            ul {
                width: 100%;
                height: 1rem;

                li {
                    width: 25%;
                    height: 1rem;
                    line-height: 1rem;
                    text-align: center;
                    font-size: .3rem;
                    color: #333333;

                }

                .active {
                    border-bottom: .03rem solid #d19e29;
                }
            }

            .navs {
                width: 100%;
                height: 1rem;
                background: #FFFFFF;

                ul {
                    width: 100%;
                    height: 1rem;

                    li {
                        width: 25%;
                        height: 1rem;
                        line-height: 1rem;
                        text-align: center;
                        font-size: .3rem;
                        color: #333333;

                    }

                    .active {
                        border-bottom: .03rem solid #d02629;
                    }
                }
            }

            .contain {
                width: 100%;
                height: 3rem;
            }
        }
</style>
