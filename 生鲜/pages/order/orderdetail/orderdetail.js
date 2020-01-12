// pages/orderdetail/orderdetail.js
const tools = require('../../../utils/tools.js');
var app = getApp();
Page({
  data: {
    orderlist:[],
    orderstate:"",
  },
  onLoad: function (e) {
    var vm = this;
    var list = JSON.parse(e.list)
    console.log("订单详情",list)
    vm.setData({
      orderstate: list.state,
      id: list.id,
      order_time: list.order_time,
      all_total: list.all_total,
      address: list.address,
      estimate: list.estimate,
      coupon: list.coupon,
      name: list.name,
      phone: list.phone
    })
  },
  functionbtn:function(e){
    var vm = this;
    var a=e.target.dataset.current
    if(a==0){
      console.log("去支付,调用支付接口直接支付")
    }
    else if(a==1){
      console.log("确认收货")
      //改变订单状态，然后返回订单列表
      var vm = this;
      tools.request(app.globalData.url + "/shopping/changestate", 'post', { 'order_id': vm.data.id, 'state_id': 2 })
        .then(resp => { 
          console.log("修改订单状态", resp)
          if (resp.data.msg =='订单状态修改成功'){
            wx.navigateBack({
              delta: 1
            })
          }
        })
    }
    else if(a==2){
      //去评价
      wx.navigateTo({
        url: '../assess/assess?id=' + vm.data.id,
      })
    }
  },
  onShow: function () {
    var vm = this;
    tools.request(app.globalData.url + "/shopping/order_detail", 'post', {'order_id': vm.data.id})
      .then(resp => {
        console.log("获取订单详情",resp)
        vm.setData({
          orderlist: resp.data.data
        })
      })
  }
})