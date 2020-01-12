// pages/list/list-detail/list-detail.js
const tools = require('../../../utils/tools.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls1: [],
    imgUrls2: [],
    list:{}
  },
  onLoad: function (e) {
    var vm = this;
    var list = e.list;
    list = decodeURIComponent(list);
    list = JSON.parse(list);
    console.log(list);
    if(list.class == undefined){
      tools.request(app.globalData.url + "/goods/return_varname", 'post', {'id': list.id})
        .then(resp => {
          console.log("中类名字",resp)
          list.class = resp.data.data;
          vm.setData({
            list: list
          })
          tools.request(app.globalData.url + "/goods/getImgCount", 'post', { 'category': list.class, 'variety': list.name })
            .then(resp => {
              var imgUrls1 = [];
              var imgUrls2 = [];
              console.log("tupian", resp)
              for (var a = 1; a < resp.data.data[1] + 1; a++) {
                imgUrls1.push(
                  app.globalData.url + "/goods/getImg?category=" + list.class + '&variety=' + list.name + '&id=' + 1 + '&name=' + list.name + a
                )
              }
              for (var a = 1; a < resp.data.data[2] + 1; a++) {
                imgUrls2.push(
                  app.globalData.url + "/goods/getImg?category=" + list.class + '&variety=' + list.name + '&id=' + 2 + '&name=' + list.name + a
                )
              }
              console.log(imgUrls1)
              console.log(imgUrls2)
              vm.setData({
                imgUrls1: imgUrls1,
                imgUrls2: imgUrls2
              })
            })
        })
    }else{
      vm.setData({
        list: list
      })
      tools.request(app.globalData.url + "/goods/getImgCount", 'post', { 'category': list.class, 'variety': list.name })
        .then(resp => {
          var imgUrls1 = [];
          var imgUrls2 = [];
          console.log("tupian",resp)
          for(var a=1;a<resp.data.data[1]+1;a++){
            imgUrls1.push(
              app.globalData.url + "/goods/getImg?category=" + list.class + '&variety=' + list.name + '&id=' + 1 + '&name=' + list.name + a
            )
          }
          for (var a = 1; a < resp.data.data[2]+1; a++) {
            imgUrls2.push(
              app.globalData.url + "/goods/getImg?category=" + list.class + '&variety=' + list.name + '&id=' + 2 + '&name=' + list.name +a
            )
          }
          console.log(imgUrls1)
          console.log(imgUrls2)
          vm.setData({
            imgUrls1: imgUrls1,
            imgUrls2: imgUrls2
          })
        })
    }
  },
  //添加到购物车
  addtocart: function (e){
    var vm = this
    //获取购物车的列表
    var list = wx.getStorageSync('goods_cart') || [];
    console.log("cartlist,[]", list);
    if (list.length > 0) {
      for (var i in list) {
        if (list[i].name == vm.data.list.name) {
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
        name: vm.data.list.name,
        image: vm.data.list.image,
        danwei: vm.data.list.danwei,
        num: 1,
        price: vm.data.list.price,
        selected: false
      });
    } else {
      list.push({
        name: vm.data.list.name,
        image: vm.data.list.image,
        danwei: vm.data.list.danwei,
        num: 1,
        price: vm.data.list.price,
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