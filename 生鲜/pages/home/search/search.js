// pages/home/search/search.js
var app = getApp();
const tools = require('../../../utils/tools.js')
Page({
  data: {
    list:[]
  },
  onLoad: function (options) {

  },
  //进入商品详情
  intodetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var list = {
      id: e.currentTarget.dataset.id,
      name: e.currentTarget.dataset.name,
      price: e.currentTarget.dataset.price,
      jieshao: e.currentTarget.dataset.jieshao,
      danwei: e.currentTarget.dataset.danwei,
      class: e.currentTarget.dataset.class,
      image: e.currentTarget.dataset.image
    }
    console.log("列表",list)
    list = JSON.stringify(list);
    list = encodeURIComponent(list);
    wx.navigateTo({
      url: '/pages/list/list-detail/list-detail?list=' + list
    })
  },
  //搜索
  search: function(e){
    var vm = this;
    console.log(e.detail.value);
    var city = app.globalData.city;
    tools.request(app.globalData.url + '/goods/Search', 'post', { 'area': city, 'keywords': e.detail.value})
    .then(resp=>{
      console.log(resp.data.data)
      //把数据存入list列表
      vm.setData({
        list: resp.data.data
      })
    })
  },
  //加入购物车
  clickgoods: function(e){
    console.log(e.currentTarget.dataset)
    var name = e.currentTarget.dataset.name;
    var image = e.currentTarget.dataset.image;
    var price = e.currentTarget.dataset.price;
    var danwei = e.currentTarget.dataset.danwei;
    var list = wx.getStorageSync('goods_cart') || [];
    console.log("cartlist,[]", list);
    if (list.length > 0) {
      for (var i in list) {
        if (list[i].name == name) {
          // 相等的话，给count+1（即再次添加入购物车，数量+1）  
          list[i].num = list[i].num + 1;
          // 最后，把购物车数据，存放入缓存（此处不用再给购物车数组push元素进去，因为这个是购物车有的，直接更新当前数组即可）
          try {
            wx.setStorageSync('goods_cart', list)
          } catch (e) {
            console.log(e)
          }
          wx.showToast({
            title: '加入购物车成功！',
            icon: 'success',
            duration: 2000
          });
          return;
        }
      }
      list.push({
        name: name,
        image: image,
        danwei: danwei,
        num: 1,
        price: price,
        selected: false
      });
    } else {
      list.push({
        name: name,
        image: image,
        danwei: danwei,
        num: 1,
        price: price,
        selected: false
      });
    }
    // 最后，把购物车数据，存放入缓存  
    try {
      wx.setStorageSync('goods_cart', list)
      // 返回（在if内使用return，跳出循环节约运算，节约性能） 
      //关闭窗口
      wx.showToast({
        title: '加入购物车成功！',
        icon: 'success',
        duration: 2000
      });
      return;
    } catch (e) {
      console.log(e)
    }
  }
})