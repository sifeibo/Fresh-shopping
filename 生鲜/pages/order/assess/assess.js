// pages/assess/assess.js
const tools = require('../../../utils/tools.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    niming:false,//是否匿名
    star:-1,//星级评价标记
    suggest: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = parseInt(options.id);
    this.setData({
      id: id
    })
  },
  //匿名
  seticon:function(e){
    var that=this
    console.log(e.target.dataset.current)
    var a = e.target.dataset.current
    if(a=="false"){
      that.setData({
        niming:true
      })
    }
    else if(a=="true"){
      that.setData({
        niming: false
      })
    }
  },
  //5颗星
  setstar:function(e){
    var that=this
    that.setData({
      star: e.target.dataset.current
    })
  },
  //获取评价
  bindinput: function (e) {
    this.setData({
      suggest: e.detail.value
    })
  },
  //提交
  submit:function(e){
    var vm = this;
    var star = parseInt(vm.data.star)+1;
    var suggest = vm.data.suggest;
    var id = vm.data.id;
    console.log('星级', star)
    console.log('评价', suggest)
    console.log('id', id)
    tools.request(app.globalData.url + "/shopping/Evaluation", 'post', { 'order_id': id, 'level': star, 'content': suggest })
      .then(resp => {
        console.log(resp)
        //改变订单状态，然后返回订单列表
        var vm = this;
        tools.request(app.globalData.url + "/shopping/changestate", 'post', { 'order_id': vm.data.id, 'state_id': 3 })
          .then(resp => {
            console.log("修改订单状态", resp)
            if (resp.data.msg == '订单状态修改成功') {
              wx.navigateBack({
                delta: 2
              })
            }
          })
      })

  }
})