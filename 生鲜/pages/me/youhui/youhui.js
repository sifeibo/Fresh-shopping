  // pages/youhuiquan/youhuiquan.js
const tools = require('../../../utils/tools.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['未使用', '已使用/过期'],
    listno:[],
    listyes: [],
    currentTab: 0,
    total:1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    //接收总价
    if(e.total != undefined){
      console.log(e.total)
      var total = parseInt(e.total)
      console.log("传入总价", total)
      this.setData({
        total: total
      })
    }
    //领取优惠卷
    // tools.request(app.globalData.url + "/coupon/addcoupons", 'post', {'coupons_id': 2})
    //   .then(resp => {
    //     console.log("领取优惠卷",resp)
    //   })
  },
  onShow:function(e){
    var vm = this;
    //修改优惠券状态
    // tools.request(app.globalData.url + "/coupon/changestate", 'post', { 'user_coupons_id': 1 })
    //   .then(resp => {
    //     console.log("获取优惠券信息", resp)
    //   })
    tools.request(app.globalData.url + "/coupon/coupons", 'post', {})
    .then(resp=>{
      console.log("获取优惠券信息",resp)
      vm.setData({
        listno: resp.data.data.list_no,
        listyes: resp.data.data.list_yes
      })
    })
  },

  // 导航栏选择
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  //使用优惠券
  useTap: function (e) {
    console.log("优惠价格", e.currentTarget.dataset.denomination)
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    if (prevPage.__route__ == 'pages/shoppingcart/pay/pay') {
      console.log("为pay页面的youhui赋值")
      prevPage.setData({
        youhui: e.currentTarget.dataset.denomination,
        youhuiid: e.currentTarget.dataset.id
      })
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.switchTab({
        url: '/pages/list/list',
      })
    }
  }
})