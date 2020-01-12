// pages/orders/orders.js
const tools = require('../../utils/tools.js');
var app = getApp();
Page({
  data: {
    list:['待支付','待收货','待评价','已完成','全部订单'],
    currentTap:0,
    list1: [],
    list2: [],
    list3: [],
    list4: [],
    list_all: []
  },
  onLoad: function (e) {
    console.log(e.id)
    this.setData({
      currentTap: parseInt(e.id)
    })
  },
  //点击切换
  clickTap:function(e){
    console.log(e.currentTarget.dataset.index)
    if (this.data.currentTap == e.currentTarget.dataset.index) {
      return false;
    } else {
      this.setData({
        currentTap: e.currentTarget.dataset.index
      })
    }
  },
  //滑动切换
  swiperTap:function(e){
    this.setData({
      currentTap: e.detail.current
    });
  },
  //订单详情
  orderDetail:function(e){
    var that=this;
    var list = {
      state: e.currentTarget.dataset.state,
      id: e.currentTarget.dataset.id,
      order_time: e.currentTarget.dataset.time,
      all_total: e.currentTarget.dataset.alltotal,
      estimate: e.currentTarget.dataset.estimate,
      goods_total: e.currentTarget.dataset.goods_total,
      address: e.currentTarget.dataset.address,
      name: e.currentTarget.dataset.name,
      phone: e.currentTarget.dataset.phone,
      coupon: e.currentTarget.dataset.coupon,
      shoping_fee: e.currentTarget.dataset.shoping_fee
    }
    list = JSON.stringify(list)
    wx.navigateTo({
      url: '/pages/order/orderdetail/orderdetail?list=' + list,
    })
  }, 
  onShow: function () {
    var vm = this
    //获取所有订单
    tools.request(app.globalData.url + "/shopping/allorders", 'post', {})
      .then(resp => {
        console.log("所有订单信息",resp)
        vm.setData({
          list_all: resp.data.data[0],
          list1: resp.data.data[1],
          list2: resp.data.data[2],
          list3: resp.data.data[3],
          list4: resp.data.data[4]
        })
        console.log(vm.data.list_all)
      })
    // //获取订单详情
    // tools.request(app.globalData.url + "/shopping/order_detail", 'post', {'order_id':18})
    //   .then(resp => {
    //     console.log("订单详情", resp)
    //   })

  }
})