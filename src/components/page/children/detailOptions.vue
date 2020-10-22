<template>
  <transition>
    <div class="detail-wrap" v-show="$store.state.const_join">
      <div class="content-main">
        <div class="padd">
          <div class="contet-item clearfix" v-if="$store.state.commodity_data">
<!--            :src="URL + $store.state.commodity_data.images[0].pic_url"-->
                <img
                  class="product-img"
                  v-if="tempequal == false 
                  && $store.state.commodity_data.goods.pic_url != null
                  && $store.state.commodity_data.goods.pic_url != ''"
                  :src="URL + $store.state.commodity_data.goods.pic_url"
                />
                <img
                  class="product-img"
                  v-else-if="tempequal == false 
                  && ($store.state.commodity_data.goods.pic_url == '' || $store.state.commodity_data.goods.pic_url == null)"
                  alt
                  src="http://center.shopsn.cn/Uploads/goods/2019-08-16/5d564e9785339.jpg"
                />

                <img
                  class="product-img"
                  v-else-if="!$store.state.commodity_data.goods.pic_url"
                  :src="URL + productData.pic_url"
                />
                <img
                  class="product-img"
                  v-else
                  alt
                  :src="URL + $store.state.commodity_data.goods.pic_url"
                />
            <p v-if="spec.spec_children && tempequal == false && tempselectedList == spec.spec_children.length && onecount == 1" class="item">{{ data.goods.title }}</p>
            <p v-else class="item">{{data.goods.title }}{{activeItem}}</p>
<!-- data.goods.title -->
            <span v-if="tempequal == false" class='item' style='color:red;font-size:14px'>
              ￥
              <!-- <em v-if="$store.state.commodity_data.goods.p_id==0">{{productData.price_member}}sss</em> -->
              <em >{{$store.state.commodity_data.goods.price_member}}</em>
            </span>
            <span v-else class='item' style='color:red;font-size:14px'>
              ￥
              <em v-if="$store.state.commodity_data.goods.p_id==0">{{productData.price_member}}</em>
              <em v-else>{{$store.state.commodity_data.goods.price_member}}</em>
            </span>
            <!-- <span class="new" style="margin-left:10px">
              原价 ：￥
              <s>{{$store.state.commodity_data.goods.price_market}}</s>
            </span> -->
            <div class="price" v-if="$route.params.status ==1">
              <div v-if="login==1">
                <div v-if="flag">
                  <span class="orc">
                    <em>￥{{$store.state.commodity_data.goods.price_market}}</em>
                  </span>
                  <span
                    v-if="$store.state.commodity_data.goods.price_market != $store.state.commodity_data.goods.price_member"
                    class="new"
                  >￥{{$store.state.commodity_data.goods.price_member}}</span>
                  <img
                    v-if="$store.state.commodity_data.goods.price_market != $store.state.commodity_data.goods.price_member"
                    src="../../../assets/star.png"
                    alt
                  />
                </div>
                <div v-else>
                  <span
                    v-if="$store.state.commodity_data.goods.price_market != $store.state.commodity_data.goods.price_member"
                    class="orc"
                  >
                    <em>￥{{$store.state.commodity_data.goods.price_member}}~{{$store.state.commodity_data.goods.price_market}}</em>
                  </span>
                  <span v-else class="orc">
                    <em>￥{{$store.state.commodity_data.goods.price_market}}</em>
                  </span>
                </div>
              </div>
              <span
                v-if="$store.state.commodity_data.goods.packaging"
              >{{$store.state.commodity_data.goods.packaging}}</span>
              <span v-else></span>
            </div>
            <p class="price" v-else>
              <span>{{$store.state.commodity_data.goods.integral}}积分</span>
              <span
                v-if="$store.state.commodity_data.goods.packaging"
              >{{$store.state.commodity_data.goods.packaging}}</span>
              <span v-else></span>
            </p>
            <span class="delete-btn" @click="remove">×</span>
          </div>

          <div class="content-scroll">
            <div v-if="spec.spec_group">
              <div
                      class="gui clearfix"
                      id="specifications"
                      v-for="(item,index) in spec.spec_group"
                      :key="item.id"
              >
                <p>{{item.name}}</p>
                <div v-if="tempequal == false">
                    <div v-for="(data, i) in spec.spec_children" :key="'A' + i">
                          <span v-if="item.id == data.spec_id"
                                :data-id="data.id"
                                :data-spec-id="data.spec_id"
                                :class="{ active: data.selectedItem == true, gray: emptyStockGoods.indexOf(Number(data.id)) != -1 }"
                                @click="addClass(index,$event,data.id, item.id); sendValue(data, data.id, subIndex[index])"
                          >
                              {{data.item}}
                          </span>
                    </div>
                </div>
                <div v-else>
                    <div v-for="data in spec.spec_children" :key="data.id">
                          <span v-if="item.id == data.spec_id"
                                :data-id="data.id"
                                :data-spec-id="data.spec_id"
                                :class="{ gray: emptyStockGoods.indexOf(Number(data.id)) != -1, active:subIndex[index] == data.id, activeTab: activeItem == data.item }"
                                @click="addClass(index,$event,data.id); sendValue(data, data.id, subIndex[index])"
                          >
                              {{data.item}}
                          </span>
                    </div>
                </div>
              </div>
            </div>
            

            <!-- 选择 长度 -->
            <div class="addSub" v-if="$store.state.commodity_data.goods.customized == 1">
              <span class="pull-left fl">长度(米)</span>
              <div class="pull-right fr clearfix">
                <div class="input-main fl clearfix">
                  <button class @click="reduceRice">-</button>
                  <input type="text" class v-model="rice" @blur.prevent="minRice" />
                  <button class="rightB" @click="plusRcie">+</button>
                </div>
              </div>
            </div>

            <!-- 数量增加减少 -->
            <div class="addSub">
              <span class="pull-left fl">数量</span>
              <div class="pull-right fr clearfix">
                <!--<span class="stock fl"-->
                <!--v-if="$store.state.commodity_data.goods.stock">库存：{{data.goods.stock}}件</span>-->
                <div class="input-main fl clearfix">
                  <button class @click="reduce">-</button>
                  <input
                    type="tel"
                    class="fl"
                    :maxlength="data.goods.stock.length"
                    v-model="$store.state.commodity_val"
                    @blur.prevent="min"
                  />
                  <button class="rightB" @click="plus">+</button>
                </div>
              </div>
            </div>

            <!-- 共计 -->
            <div class="com">
              <div></div>
              <div>
                数量：
                <span>{{$store.state.commodity_data.goods.customized == 1 ? (Number($store.state.commodity_val) * rice).toFixed(2) : Number($store.state.commodity_val)}}</span>&nbsp;&nbsp; 共计
                <span v-if="$store.state.commodity_data.goods.p_id==0">
                  <i>￥</i>
                  {{$store.state.commodity_val * productData.price_member|keepTwoNum}}
                </span>
                  <span v-else-if="$route.params.status ==1">
                  <i>￥</i>
                  {{$store.state.commodity_val * data.goods.price_member|keepTwoNum}}
                </span>
                <span v-else>
                  {{$store.state.commodity_val * $store.state.commodity_data.goods.integral}}
                  <i>积分</i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="btn-join clearfix" v-if="$route.params.status == 1">
          <button class="fl imm" @click="toOrder">立即购买</button>
          <button class="join fl" @click="join">加入购物车</button>
        </div>
        <div class="btn-join clearfix" v-if="$route.params.status == 2">
          <button class="fr imm" @click="remove">确定</button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import qs from "qs";
import { Toast } from "mint-ui";
import Vue from "vue";

export default {
  name: "detailOptions",
  data() {
    return {
      activeItem: '',
      status: "",
      guigedata: [],
      guigeid: [],
      guigedata_name: "",
      isactive: "",
      flag: false,
      specKey: "", // 选中的规格
      spec: [],
      length: [],
      login: sessionStorage.getItem("login"),
      problem: "",
      rice: 1,
      emptyStockGoods: [],
      subIndex: [],
      allAttribute: [],
      selected: '',
      detailId: null,
      detailSubId: null,
      addClassClick: false,
      tempValue: false,
      tempequal: true,
      totalequal: 0,
      childequal: 0,
      tempselectedList: [],
      childitems: '',
      onecount: 0
    };
  },
  props: {
    data: "",
    productData: ""
  },
  mounted() {
    if (this.spec.length == 0) {
      this.guige();
    }
    this.$store.state.rice = "";


  },
  methods: {
    shoppingAjax() {
      this.axios
        .post(
          this.$httpConfig.orderBegin,
          QS.stringify({
            price_sum: "",
            goods_id: this.$route.params.id,
            problem: this.problem
          })
        )
        .then(res => {
          if (res.data.status == 10001) {
            this.$router.replace("/LogIn");
          } else {
            Toast({
              message: res.data.message,
              position: "bottom",
              duration: 1000
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    sendValue(detail, id, subId){
      // console.log(spec+":data.time|data.id:"+id)

      // if(detail && (id == subId)) {
      //     console.log("Vue  " +  JSON.stringify(this.selected), id, subId)
      // } else {
      //     console.log("Vue  not equall ")
          this.selected = detail;
          this.detailSubId = subId;
          this.detailId = id
      // }
      this.$emit('sendValue', detail, id, subId);
      this.arrayKey = id;
      // this.zeroPrice();
    },
    guige() {
      //规格
      this.axios
        .post(
          this.$httpConfig.goodSpecsByGoodsChildren,
          qs.stringify({
            id: this.data.goods.id
          })
        )
        .then(res => {
          if (res.data.status == 1) {
            this.guigedata = res.data.data;
            this.spec = res.data.data.spec;
            //获取当前商品选中的规格


// let tempdata = this.spec.spec_children
// this.tempequal = tempdata.every((val, i, arr) => val.spec_id == arr[0].spec_id)
// if(this.tempequal == false) {
//   for(var i = 0; i < tempdata.length; i++) {
//     this.spec.spec_children[i].selectedItem = true
//   }
// }   
           
for (var i in this.spec.spec_group) {
    for (var j = 0; j < this.spec.spec_children.length; j++) {
        if (this.spec.spec_children[j].spec_id == i) {
            this.$set(
                this.spec.spec_children[j],
                "selectedItem",
                true
            );
            break;
        }
    }
}
let tempdata = this.spec.spec_children
this.tempequal = tempdata.every((val, i, arr) => val.spec_id == arr[0].spec_id)
if(this.tempequal == false && this.spec.spec_children[0].selectedItem == true) {
  this.tempselectedList = this.spec.spec_children.length
  this.onecount += 1;
  // $store.state.commodity_data.goods.price_member

  let goodsId = '';
  for (let i in this.guigedata.goods) {
      goodsId = this.guigedata.goods[i].goods_id;
  }
  console.log('good id ' + goodsId)
  this.getData(goodsId)
  
  this.childitems = ' '
  for (var j = 0; j < this.spec.spec_children.length; j++) {
      this.childitems += this.spec.spec_children[j].item+ " "
  }
  
}





            this.activeItem = this.spec.spec_children[0].item;
            this.$store.state.selectionSpec = [];

            if (
              this.getArrayLenght(this.spec.spec_group) == 1 &&
              this.emptyStockGoods.length == 0
            ) {
              for (var i in this.guigedata.goods) {
                if (this.guigedata.goods[i].stock == 0) {
                  this.emptyStockGoods.push(
                    Number(this.guigedata.goods[i].key)
                  );
                }
              }
            }

            // for (var i in this.spec.spec_group) {
            //     for (var j = 0; j < this.spec.spec_children.length; j++) {
            //         if (this.spec.spec_group[i].id == this.spec.spec_children[j].spec_id && this.specKey != '') {
            //             if (this.guigedata.goods[this.specKey].key.indexOf(this.spec.spec_children[j].id) > -1) {
            //                 this.$store.state.selectionSpec.push(this.spec.spec_children[j].item)
            //             }
            //         }
            //     }
            // }
          }
        });
    },
    reduce() {
      if (this.$store.state.commodity_val <= 1) return;
      this.$store.state.commodity_val--;
    },
    reduceRice() {
      if (this.rice <= 0.1) return;
      this.rice = (this.rice - 0.01).toFixed(2);
    },
    plus() {
      if (
        this.$store.state.commodity_val >=
        parseInt(this.$store.state.commodity_data.goods.stock)
      )
        return;
      this.$store.state.commodity_val++;
    },
    plusRcie() {
      this.rice = (Number(this.rice) + 0.01).toFixed(2);
    },
    min() {
      let val = parseInt(this.$store.state.commodity_val);
      let reg = /(^[1-9]([0-9]*)$|^[0-9]$)/;
      if (!reg.test(val) || val == 0) {
        this.$store.state.commodity_val = 1;
      }
      if (val >= this.data.goods.stock)
        this.$store.state.commodity_val = this.data.goods.stock;
    },
    minRice() {
      var match = /^(\d+(\.\d)?)(\d*)$/;
      var ok = match.test(Number(this.rice));

      let val = parseInt(this.rice);
      let reg = /(^[1-9]([0-9]*)$|^[0-9]$)/;
      if (!reg.test(val) || val == 0) {
        this.rice = 1;
      }
    },
    remove() {
      this.$store.state.const_join = false;
    },
    getArrayLenght(array) {
      var count = 0;
      for (var i in array) {
        count++;
      }
      return count;
    },
    //选择规格重新获取数据
    getData(id) {
      this.axios({
        url: this.$httpConfig.goodInfo,
        method: "get",
        params: {
          id: id
        }
      })
        .then(res => {
          this.$store.state.commodity_data = res.data.data;
          //   Toast(res.data.data.goods.stock);
          if (this.$store.state.goods_id == "") {
            this.flag = false;
          } else {
            this.flag = true;
          }
          this.$store.state.commodity_val = 1;
          this.$emit("recommend");
        })
        .catch(err => {
          console.log(err);
        });
    },
    
    addClass(index, event, id, groupid) {
        this.addClassClick = true
        console.log(this.data.goods)
        //   this.activeItem = data.item;
        this.activeItem = '';
        this.onecount = 0
        
        if(this.tempequal == false) {
          for(let i = 0; i < this.spec.spec_children.length; i++) {
              if(this.spec.spec_children[i].spec_id == groupid) {
                if(this.spec.spec_children[i].id == id) {
                  if(this.spec.spec_children[i].selectedItem == true) {
                      this.spec.spec_children[i].selectedItem = false
                  } else {
                      this.spec.spec_children[i].selectedItem = true
                  }
                }
              }
          }
        } 
        // else {
        //   for(let i = 0; i < this.spec.spec_children.length; i++) {
        //             $('#specifications span').each(function (i, e) {
        //                     let specId = $(e).data('spec-id');
        //                     if (specId == index) {
        //                         $(e).removeClass('active');
        //                     }
        //             })
        //             console.log("1ssssss " + this.spec.spec_children[i].spec_id)
        //             console.log("2ssssss " + groupid)
        //             console.log("3ssssss " + this.spec.spec_children[i].id)
        //             console.log("4ssssss " + id)
        //   }
        //   for(let i = 0; i < this.spec.spec_children.length; i++) {
        //     if(this.spec.spec_children[i].spec_id == groupid) {
        //         if(this.spec.spec_children[i].id == id) {
        //             if(this.spec.spec_children[i].selectedItem == false) {
        //                 this.spec.spec_children[i].selectedItem = true
        //             } else {
        //                 this.spec.spec_children[i].selectedItem = false
        //             }
        //         }
        //     }
        //   }
        // }
        
        
      
      if (this.emptyStockGoods.indexOf(Number(id)) != -1) {
        return;
      }
      if (
        this.getArrayLenght(this.subIndex) ==
        this.getArrayLenght(this.spec.spec_group)
      ) {
        //选中商品后重新选择规格 清除选中的规格项
        this.$store.state.selectionSpec = [];
      }

      if (
        this.getArrayLenght(this.subIndex) ==
          this.getArrayLenght(this.spec.spec_group) &&
        this.getArrayLenght(this.subIndex) > 2
      ) {
        this.subIndex = [];
        this.emptyStockGoods = [];
      }
      if (this.subIndex[index] != id) {
        //给选中的规格项添加样式
        this.subIndex[index] = id;
        Vue.set(this.subIndex, index, id);
      } else {
        this.subIndex[index] = -1;
        Vue.set(this.subIndex, index, -1);
      }

      // $('#specifications span').each(function (i, e) {
      //     let specId = $(e).data('spec-id');
      //     if (specId == index) {
      //         $(e).removeClass('active');
      //     }
      // })
      //获取所有选中的规格

      var self = this;
      setTimeout(function() {
        if (self.getArrayLenght(self.spec.spec_group) > 2) {
          self.checkStock(index, id);
        } else if (self.getArrayLenght(self.spec.spec_group) == 2) {
          self.checkStock1();
        }

        let selectedList = [],
          sortList = "",
          str = "",
          goodsId = "";
        $("#specifications span").each(function(i, e) {
          if ($(e).hasClass("active")) {
            selectedList.push($(e).data("id"));
          }
        });


        //排序
        sortList = selectedList.sort((a, b) => {
          return a > b ? 1 : -1;
        });

        //字符串拼接
        var count = 0;
        for (var i in self.spec.spec_group) {
          count++;
        }
        str = sortList.join("_");


        //对比
        for (let i in self.guigedata.goods) {
          if (str === self.guigedata.goods[i].key) {
            goodsId = self.guigedata.goods[i].goods_id;
          }
        }
        if (goodsId) {
          self.$store.state.goods_id = goodsId;
          self.getData(goodsId);
          self.specKey = goodsId;
        }



        if(self.tempequal == false && Object.keys(selectedList).length != self.spec.spec_children.length) {
            self.getData(self.$route.params.id);
        } else if(self.tempequal != false) {
            var count = 0;
            self.subIndex.forEach((item, index) => {
              if (item == -1) {
                count++;
              }
            });
            if (
              self.getArrayLenght(self.subIndex) !=
                self.getArrayLenght(self.spec.spec_group) ||
              count != 0
            ) {
              if (self.$store.state.goods_id != "") {
                self.$store.state.goods_id = "";
                self.specKey = "";
                self.getData(self.$route.params.id);
              }
            }
        }

      }, 100);

      
      let tempcount = 0
      for(let i = 0; i < this.spec.spec_children.length; i++) {
          if(this.spec.spec_children[i].selectedItem == true) {
            tempcount++
          } 
      }


      this.tempselectedList = tempcount

      this.totalequal = tempcount
      this.childequal = this.spec.spec_children.length



    },
    digitization(arr) {
      arr.forEach((item, index) => {
        arr[index] = Number(arr[index]);
      });
      return arr;
    },
    getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) == arr.lastIndexOf(v);
      });
    },
    uniq(array) {
      var temp = []; //一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    },
    checkStock(index, id) {
      //规格项超过两个 致灰方法
      var goods = this.guigedata.goods;
      var count = 0;
      var count1 = this.getArrayLenght(this.spec.spec_group);
      var data = [];
      for (var i in this.subIndex) {
        count++;
        data.push(this.subIndex[i]);
      }
      this.emptyStockGoods = [];
      var array = [];
      if (count == count1 - 1) {
        for (var i in goods) {
          var count3 = 0;
          data.forEach((item, index) => {
            if (goods[i].key.indexOf(item) != -1) {
              count3++;
            }
          });

          if (count3 == data.length && goods[i].stock == 0) {
            array = this.getArrDifference(data, goods[i].key.split("_"));
          }
        }
        this.emptyStockGoods = this.digitization(array);
      }
      // for(var j=0; j<data.length; j++){
      //     for(var i in goods){
      //         if(goods[i].key.indexOf(data[j]) != -1 && goods[i].stock != 0){
      //             console.log(goods[i].key);
      //             this.emptyStockGoods = this.emptyStockGoods.concat(goods[i].key.split('_'));
      //
      //         }
      //     }
      // }
      // this.emptyStockGoods = this.uniq(this.emptyStockGoods);
      // this.emptyStockGoods = this.digitization(this.getArrDifference(this.emptyStockGoods,this.allAttribute));
    },
    checkStock1() {
      ////规格项低于等于两个 致灰方法
      var count = 0;
      var data = [];
      var goods = this.guigedata.goods;
      for (var i in this.subIndex) {
        count++;
        data.push(this.subIndex[i]);
      }
      this.emptyStockGoods = [];
      data.forEach((item, index) => {
        for (var i in goods) {
          if (goods[i].key.indexOf(item) != -1 && goods[i].stock == 0) {
            var array = 0;
            var array1 = [];
            array1.push(item);
            array = this.getArrDifference(array1, goods[i].key.split("_"))[0];
            this.emptyStockGoods.push(Number(array));
          }
        }
      });
    },
    getGoodInfo(id) {
      this.axios
        .post(
          this.$httpConfig.getGoodInfo,
          qs.stringify({
            id: id
          })
        )
        .then(res => {})
        .catch(err => {
          console.log(err);
        });
    },

    toExchange() {
      this.$store.state.goods = JSON.stringify([
        {
          num: this.$store.state.commodity_val,
          id: this.$route.params.id,
          goods_price: this.$store.state.commodity_data.price_member
        }
      ]);
      this.$store.state.const_join = false;
      this.$router.push({
        name: "order",
        params: {
          id: 3,
          goods: JSON.parse(this.$store.state.goods)
        }
      });
    },
      toOrder() {


          sessionStorage.removeItem("invoiceGroup");
          sessionStorage.removeItem("invoiceInit");
          this.$store.state.invoice = false;
          this.$store.state.rise = null;
          this.$store.state.type = null;
          this.$store.state.content = null;
          this.$store.state.invoice_id = "";
          var count = 0;
          this.subIndex.forEach((item, index) => {
              if (item == -1) {
                  count++;
              }
          });
          // if (
          //   this.getArrayLenght(this.subIndex) !=
          //     this.getArrayLenght(this.spec.spec_group) ||
          //   count != 0
          // ) {
          //   Toast({
          //     message: "请选择商品规格",
          //     duration: 1000
          //   });
          //   return;
          // }
          
          if(this.tempequal == false) {
              if (this.$store.state.commodity_data.goods.stock == 0) {
                  Toast({
                      message: "库存不足",
                      duration: 1000
                  });
                  return;
              }
              if (this.$store.state.commodity_data.goods.customized == 1) {
                  this.$store.state.rice = this.rice;
              }
              
              if(this.totalequal == this.childequal && this.productData.id) {
                  let goods_id = "";
                  if (this.$store.state.goods_id) {
                      goods_id = this.$store.state.goods_id;
                  } else if(this.productData.id) {
                      goods_id = this.productData.id;
                  }

                  if(goods_id) {
                      this.$router.push({
                          name: "order",
                          params: {
                              good_id: goods_id,
                              num: this.$store.state.commodity_val,
                              sub_id: "commonGood",
                              id: 2
                          }
                      });
                  }
              } else {
                      Toast({
                        message: "请选择商品规格",
                        duration: 1000
                      });
                      return;
              }

          } else if(this.tempequal == true) {
                  if (this.detailId != this.detailSubId) {
                    Toast({
                      message: "请选择商品规格ss",
                      duration: 1000
                    });
                    return;
                  }
                  if (this.$store.state.commodity_data.goods.stock == 0) {
                      Toast({
                          message: "库存不足",
                          duration: 1000
                      });
                      return;
                  }
                  let goods_id = "";
                  // if(this.addClassClick == true) {
                  //
                  // }
                  
                  if (this.$store.state.goods_id) {
                      goods_id = this.$store.state.goods_id;
                  }
                  //  else {
                  //   goods_id = this.$route.params.id;
                  // }
                  
                  else if(this.productData.id) {
                        goods_id = this.productData.id;
                  }
                  
                  if (this.$store.state.commodity_data.goods.customized == 1) {
                      this.$store.state.rice = this.rice;
                  }
                  this.$router.push({
                      name: "order",
                      params: {
                          good_id: goods_id,
                          num: this.$store.state.commodity_val,
                          sub_id: "commonGood",
                          id: 2
                      }
                  });
          }
      },
    join() {
        // index, event, id
      if(this.tempequal == false) {  
          if(this.activeItem !== '') {
              if (this.subIndex[Object.keys(this.spec.spec_group)] != this.spec.spec_children[0].id) {
                  let tempsubindex = (this.spec.spec_group)
                  if(this.tempselectedList == Object.keys(tempsubindex).length) {
                      this.subIndex = []
                      for (var i in tempsubindex) {
                        this.subIndex.push([i]);
                      }
                  } else {
                      this.subIndex[Object.keys(this.spec.spec_group)] = this.spec.spec_children[0].id;
                      Vue.set(this.subIndex, Object.keys(this.spec.spec_group), this.spec.spec_children[0].id);
                  }
              } 
              else {
                  this.subIndex[Object.keys(this.spec.spec_group)] = -1;
                  Vue.set(this.subIndex, Object.keys(this.spec.spec_group), -1);
              }
          } else {
                  let tempsubindex = (this.spec.spec_group)
                  if(this.tempselectedList == Object.keys(tempsubindex).length) {
                      this.subIndex = []
                      for (var i in tempsubindex) {
                        this.subIndex.push([i]);
                      }
                  } 
                  else {
                      if(this.tempselectedList == 0) {
                          this.subIndex[Object.keys(this.spec.spec_group)] = this.spec.spec_children[0].id;
                          Vue.set(this.subIndex, Object.keys(this.spec.spec_group), this.spec.spec_children[0].id);
                      }
                  }
          }
      }  
      else {
          if(this.activeItem !== '') {
              if (this.subIndex[Object.keys(this.spec.spec_group)] != this.spec.spec_children[0].id) {
                  this.subIndex[Object.keys(this.spec.spec_group)] = this.spec.spec_children[0].id;
                  Vue.set(this.subIndex, Object.keys(this.spec.spec_group), this.spec.spec_children[0].id);
              } else {
                  this.subIndex[Object.keys(this.spec.spec_group)] = -1;
                  Vue.set(this.subIndex, Object.keys(this.spec.spec_group), -1);
              }
          }
      }
      var count = 0;
      this.subIndex.forEach((item, index) => {
        if (item == -1) {
          count++;
        }
      });
      
      if (
        this.getArrayLenght(this.subIndex) !=
          this.getArrayLenght(this.spec.spec_group) ||
        count != 0
      ) {
        Toast({
          message: "请选择商品规格",
          duration: 1000
        });
        return;
      }
      if (this.$store.state.commodity_data.goods.stock == 0) {
        Toast({
          message: "库存不足",
          duration: 1000
        });
        return;
      }

      if (this.$store.state.commodity_data.goods.customized == 1) {
        this.$store.state.rice = this.rice;
      }

      for (let i = 0; i < this.$store.state.guigeid.length; i++) {
        if (!this.$store.state.guigeid[i]) {
          Toast("请选择" + this.$store.state.guigeName[i]);
          return;
        }
      }
      if (
        this.$store.state.commodity_val == "" ||
        this.$store.state.commodity_val == 0
      ) {
        Toast("请选择商品数量");
        return false;
      }
      this.axios
        .post(
          this.$httpConfig.addGoodToCart,
          qs.stringify({
            goods_id: this.data.goods.id,
            goods_num: this.$store.state.commodity_val,
            price_new: this.data.goods.price_new,
            store_id: this.data.goods.store_id,
            price_new: this.data.goods.price_member
          })
        )
        .then(res => {
          if (res.data.status == 10001) {
            this.$router.replace("/LogIn");
          } else {
            if (res.data.status == 0) {
              Toast({
                message: res.data.message,
                duration: 1000
              });
            } else if (res.data.status == 1) {
              Toast({
                message: res.data.message,
                duration: 1000
              });
              this.$store.state.catr_number += parseInt(
                this.$store.state.commodity_val
              );
              this.$store.state.const_join = false;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.r {
  float: right;
}

.detail-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;

  .content-main {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    border-top-left-radius: .3rem;
    border-top-right-radius: .3rem;

    .padd {
      padding: 7px;

      .contet-item {
        padding: 0 0 0.4rem;
        position: relative;
        border-bottom: 1px solid #dfe3e4;

        .product-img {
          width: 1.77rem;
          height: 1.77rem;
          border-radius: 10px;
          position: absolute;
          top: -0.05rem;
          left: 0;
        }

        .item {
          padding-left: 1.92rem;
          padding-top: 0.36rem;
          width: 4.8rem;
          height: 0.8rem;
          font-size: 0.26rem;
          color: #333;
          line-height: 0.4rem;
          overflow: hidden;
        }

        .price {
          padding-left: 1.92rem;
          padding-top: 0.1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .orc {
            color: #a53533;

            em {
              font-style: normal;
              font-size: 0.32rem;
            }
          }

          .new {
            color: #0f0f0f;
            font-size: 0.26rem;
          }

          img {
            display: inline-block;
            width: 0.7rem;
            vertical-align: middle;
            margin-bottom: 0.04rem;
          }

          span {
            font-size: 0.32rem;
            color: #a22d2b;
            .market-price {
              display: inline-block;
              margin-left: 0.06rem;
              font-size: 0.24rem;
              color: #999;
              text-decoration: line-through;
            }
          }
          span:nth-child(2) {
            color: #333333;
            font-size: 0.26rem;
          }
        }

        .delete-btn {
          position: absolute;
          right: 0;
          top: 0.2rem;
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

      .content-scroll {
        height: 7rem;
        overflow-y: scroll;

        .gui {
          padding: 0.3rem 0;
          border-bottom: 1px solid #dfe3e4;

          p {
            font-size: 0.32rem;
            color: #000000;
            margin-bottom: 10px;
          }

          span {
            margin-left: 0.1rem;
            padding: 0 0.2rem;
            height: 0.5rem;
            text-align: center;
            border: 1px solid #757575;
            border-radius: 3px;
            float: left;
            line-height: 0.5rem;
            color: #757575;
            margin-bottom: 0.2rem;
            font-size: 0.3rem;
          }

          span:last-child {
            margin-right: 0px;
          }
          .active {
            border-color: #a22d2b;
            color: #a22d2b;
          }
          .gray {
            border-color: #e3e3e3;
            color: #e3e3e3;
          }
          .activeTab {
            border-color: #a22d2b;
            color: #a22d2b;
          }
        }
      }

      .addSub {
        height: 1rem;
        border-bottom: 1px solid #dfe3e4;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .pull-left {
          font-size: 0.32rem;
          color: #757575;
        }

        .pull-right {
          .stock {
            font-size: 0.24rem;
            color: #aeadad;
          }

          .input-main {
            height: 0.79rem;
            border-radius: 5px;
            overflow: hidden;
            line-height: 0.79rem;
            display: flex;
            align-items: center;

            button {
              width: 0.7rem;
              border: none;
              font-size: 0.4rem;
              line-height: 0.6rem;
              outline: none;
              height: 80%;
              background: #f5f5f5;
              color: #8b8b8b;
            }

            span {
              margin-left: 0.2rem;
              color: #999;
              font-size: 0.32rem;
            }

            button:nth-child(1) {
              margin-right: 0.2rem;
            }

            .rightB {
              margin-left: 0.2rem;
            }

            button:active {
              background: #a22d2b;
              color: #fff;
            }

            input {
              width: 1.45rem;
              height: 80%;
              border: 1px solid #dfdfdd;
              text-align: center;
              font-size: 0.4rem;
              color: #757575;
            }
          }
        }
      }

      .com {
        display: flex;
        justify-content: space-between;
        > div {
          height: 1.2rem;
          line-height: 1.2rem;
          text-align: right;
          font-size: 0.32rem;
          color: #666;

          span {
            font-size: 0.36rem;
            color: #a22d2b;
            font-weight: bold;

            i {
              font-size: 0.32rem;
              font-style: normal;
            }
          }
        }
      }
    }

    .btn-join {
      button {
        width: 50%;
        border: none;
        height: 1rem;
        line-height: 1rem;
        color: #fff;
        font-size: 0.32rem;
      }

      .join {
        background: #F40;
      }
      .imm {
        background: #FFE4D0;
        color: #E5511D
      }
    }
  }
}
</style>