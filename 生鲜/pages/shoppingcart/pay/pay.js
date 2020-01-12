// pages/shoppingcart/pay/pay.js
const tools = require('../../../utils/tools.js')
var app = getApp()
Page({
  data: {
    list: [],
    //优惠卷
    youhui: 0,
    youhuiid:null,
    //配送费
    peisong: 2,
    suggest:'',
    timearray: ['10:00-11:00', '16:00-17:00'],
    timevalue: 0,
    time: null,
    day:0,
    order_id:null
  },
  onLoad: function (e) {
    // var list = e.list;
    // list = JSON.parse(list);
    var totalprice = parseFloat(e.totalprice);
    // console.log("传入列表", list)
    // console.log("传入总价", e.totalprice)
    var list = wx.getStorageSync('goods_cart');
    let listselected = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].selected) {
        listselected.push(list[i])
      }
    }
    console.log(list)
    this.setData({
      list: listselected,
      total: totalprice,
      totalprice: (totalprice + this.data.peisong - this.data.youhui).toFixed(2)
    })
  },
  onShow:function(e){
    this.setData({
      totalprice: (this.data.total + this.data.peisong - this.data.youhui).toFixed(2)
    })
  },
  //选择地址
  selectAddress:function(e){
    wx.navigateTo({
      url: '/pages/me/address/address',
    })
  },

  // 支付功能
  payFor: function () {
    if (this.data.address == undefined) {
      wx.showModal({
        title: '提示',
        content: "请填写您的收获地址！"
      })
    } else if (this.data.time == null) {
      wx.showModal({
        title: '提示',
        content: "请选择送达时间！"
      })
    } else{ //生成订单
      var vm = this;
      var date = new Date();
      var curyear = date.getFullYear();
      var curmonth = date.getMonth()+1;
      var curday = date.getDate();
      var curhour = date.getHours();
      var curmin = date.getMinutes();
      var cursec = date.getSeconds();
      //获取送货时间
      var estimated_time; 
      if (vm.data.day==1){
        var date1 = new Date();
        date1.setDate(date1.getDate() + 1);
        var today = date1.getDate();
        var toyear = date1.getFullYear();
        var tomonth = date1.getMonth() + 1;
        console.log("明天是", toyear + '/' + tomonth + "/" + today + '/' + vm.data.time)
        estimated_time = toyear + '/' + tomonth + "/" + today+ '/' +  vm.data.time
      }else{
        estimated_time = curyear + '/' + curmonth + "/" + curday + '/'+ vm.data.time
        console.log("今天是", curyear + '/' + curmonth + "/" + curday + '/' + vm.data.time)
      }
      var data = {
        address_id: vm.data.address.id,
        remarks: vm.data.suggest,
        goods_total: vm.data.total,
        coupon: vm.data.youhui,
        shopping_fee: vm.data.peisong,
        all_total: vm.data.totalprice,
        order_time: curyear + '/' + curmonth + '/' + curday + '/'+ curhour + ':' + curmin + ':' + cursec,
        estimated_time: estimated_time,
        list: vm.data.list
      }
      data = JSON.stringify(data);
      console.log("生成订单",data)
      //订单上传
      tools.request(app.globalData.url + "/shopping/CreateOrderandDetail", 'post', {'data': data})
        .then(resp => {
          console.log("获取订单提交信息", resp);
          //清空购物车中结算的数据
          if (resp.data.msg === "订单创建成功"){
            var list = wx.getStorageSync('goods_cart');
            for (let i = 0; i < list.length; i++) {
              if (list[i].selected) {
                list.splice(i,1);
                i--;
              }
            }
            wx.setStorageSync('goods_cart', list)
            console.log("清空购物车中结算的数据");
            //获取生成订单的id号
            vm.setData({
              order_id: resp.data.data
            })
          }
        })
      if(vm.data.youhuiid!=null){//设置优惠卷失效
        tools.request(app.globalData.url + "/coupon/changestate", 'post', { 'user_coupons_id': vm.data.youhuiid })
          .then(resp => {
            console.log("设置优惠券信息", resp.data.msg)
          })
      }
    }
  },
  //获取备注
  bindinput: function(e){
    this.setData({
      suggest:e.detail.value
    })
  },
  //选择时间
  time: function (e) {
    var date = new Date();
    var curhour = date.getHours();
    this.setData({
      time: this.data.timearray[e.detail.value],
      timevalue: e.detail.value
    })
    if (this.data.timevalue == 0) {
      if (curhour >= 10) {
        // date.setDate(date.getDate() + 1);
        // var today = date.getDate();
        // var toyear = date.getFullYear();
        // var tomonth = date.getMonth()+1;
        // console.log("明天是", toyear+'/'+tomonth+"/"+today)
        this.setData({
          day: 1
        })
        wx.showModal({
          title: '注意',
          content: '您当前选择的时段，只能明日送达',
        })
      }else{
        this.setData({
          day: 0
        })
      }
    } else {
      if (curhour >= 16) {
        this.setData({
          day: 1
        })
        wx.showModal({
          title: '注意',
          content: '您当前选择的时段，只能明日送达',
        })
      } else {
        this.setData({
          day: 0
        })
      }
    }
  },
  //优惠卷
  showBenefit: function(){
    //商品总价传入
    wx.navigateTo({
      url: '/pages/me/youhui/youhui?total=' + this.data.total,
    })
  }
})