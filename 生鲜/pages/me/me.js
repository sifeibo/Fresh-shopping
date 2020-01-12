// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonList: [
      { img: "/images/button/fukuan.png", name: '待支付' },
      { img: "/images/button/shouhuo.png", name: '待收货' },
      { img: "/images/button/pingjia.png", name: '待评价' },
      { img: "/images/button/tuikuan.png", name: '已完成' }
    ],
    list: [{ img: "/images/button/youhui.png", name: '我的红包' }, 
      { img: "/images/button/dizhi.png", name: '收获地址' },
      { img: "/images/button/jiameng.png", name: '联系我们' },
    ]
  },

  /* 按钮点击事件 */
  clickbutton: function (e) {
    var a = e.currentTarget.dataset.index
    wx.navigateTo({
      url:'/pages/order/order?id=' + a
    })
  },
  clickbutton2: function (e) {
    wx.navigateTo({
      url: '/pages/order/order?id=' + 4
    })
  },
  /* 服务内的点击事件 */
  clickbutton1: function (e) {
    var a = e.currentTarget.dataset.index
    if (a === 0) {
      //优惠卷
      wx.navigateTo({
        url: '/pages/me/youhui/youhui'
      })
    }else if (a === 1) {
      //收获地址
      wx.navigateTo({
        url: '/pages/me/address/address'
      })
    }
    else{
      wx.makePhoneCall({
        phoneNumber: '17312556080'
      })
    }
  },
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})