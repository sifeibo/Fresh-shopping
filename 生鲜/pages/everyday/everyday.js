// pages/everyday/everyday.js
const tools = require('../../utils/tools.js')
var app = getApp()
Page({
  data: {},
  onLoad: function (options) {
    tools.request(app.globalData.url + "/goods/dish", 'post', {})
      .then(resp => {
        console.log('菜谱',resp.data.data)
        this.setData({
          dish: resp.data.data
        })
      })
  },
  clickitem: function(e){
    console.log(e.currentTarget.dataset.image)
    console.log(e.currentTarget.dataset.name)
    var list={
      image: e.currentTarget.dataset.image,
      name: e.currentTarget.dataset.name
    }
    list = JSON.stringify(list)
    list = encodeURIComponent(list)
    wx.navigateTo({
      url: '/pages/everyday/cook/cook?list=' + list
    })
  }
})