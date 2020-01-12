const tools = require('../../../utils/tools.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: []
  },
  onLoad: function (e) {
    var list = decodeURIComponent(e.list);
    list = JSON.parse(list);
    console.log(list)
    this.setData({
      list: list
    })
  },
  onShow: function(e){
    var vm = this;
    tools.request(app.globalData.url + "/goods/dishimg", 'post', { 'dish_name': vm.data.list.name })
      .then(resp => {
        var imgUrls = [];
        console.log("tupian", resp)
        for (var a = 1; a < resp.data.data + 1; a++) {
          imgUrls.push(
            app.globalData.url + "/goods/dishimage?dishname=" + vm.data.list.name + '&dishnum=' + vm.data.list.name + a
          )
        }
        console.log(imgUrls)
        vm.setData({
          imgUrls: imgUrls
        })
      })
  }
})