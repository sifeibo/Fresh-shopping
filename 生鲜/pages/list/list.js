// pages/list/list.js
const tools = require('../../utils/tools.js');
var app = getApp();
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    leftcategory: [
      { name: '新鲜蔬菜', id: 'a0' },
      { name: '海鲜水产', id: 'a1' },
      { name: '新鲜水果', id: 'a2' },
      { name: '乳品面包', id: 'a3' },
      { name: '粮油调味', id: 'a4' },
      { name: '酒水饮料', id: 'a5' },
      { name: '休闲零食', id: 'a6' },
      { name: '冷藏冻品', id: 'a7' },
      { name: '厨房用品', id: 'a8' },
      { name: '肉禽蛋品', id: 'a9' },
    ],
    rightcategory:[],
    rightitem:{},
    curIndex: 0,
    curIndex1: 0,
    curName:'新鲜蔬菜',
    tag:true,
    dic:{},
    id:'a0'
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
    list = JSON.stringify(list);
    list = encodeURIComponent(list);
    wx.navigateTo({
      url: '/pages/list/list-detail/list-detail?list='+list
    })
  },
  //下拉菜单菜单栏点击
  switchTab2: function (e) {
    // console.log(e.currentTarget.dataset.id)
    this.setData({
      curIndex1: e.currentTarget.dataset.index,
      tag:true,
      id1: e.currentTarget.dataset.id
    })
  },
  //点击下拉菜单
  clickdown:function(e){
    if (this.data.tag === true) {
      this.setData({
        tag: false
      })
    }else{
      this.setData({
        tag: true
      })
    }
  },
  //点击任意处隐藏tag1
  clicktag: function (e) {
    this.setData({
      tag: true
    })
  },
  //右侧菜单栏点击，更换数组数据
  switchTab1: function (e) {
    this.setData({
      curIndex1: e.currentTarget.dataset.index
    })
  },
  //左侧菜单点击
  switchTab:function(e){
    var vm = this;
    //点击效果
    vm.setData({
      curIndex: e.currentTarget.dataset.index,
      curName: e.currentTarget.dataset.name
    })
    //更换数组数据rightcategory和rightitem
    tools.request(app.globalData.url + "/goods/Category_Vegetable", 'post', { 'class': vm.data.curName, 'city':app.globalData.city })
      .then(resp => {
        console.log("收到服务器回复", resp.data.data)
        var dic = {};
        for (var a = 0; a < resp.data.data.rightcategory.length; a++) {
          dic[resp.data.data.rightcategory[a].vegetables_category_varname] = resp.data.data.rightcategory[a].vegetables_category_name
        }
        console.log("++++++++++",dic)
        vm.setData({
          rightcategory: resp.data.data.rightcategory,
          rightitem: resp.data.data.rightitem,
          dic: dic
        })
      })

  },
  // scroll-x的点击事件
  click:function(e){
    // console.log(e.currentTarget.dataset.name)
    this.setData({
      id: e.currentTarget.dataset.id
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
    if(list.length > 0){
      for(var i in list){
        if(list[i].name == name){
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
        selected: false});
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
  },
  // 搜索商品
  search: function (e) {
    wx.navigateTo({
      url: '/pages/home/search/search',
    });
  },

  onLoad: function (options) {
    var vm = this 
    //获取设备属性
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        vm.setData({
          winHeight: res.windowHeight,
          winWidth: res.windowWidth
        });
      }
    });
  },
  onShow: function () {
    var vm = this 
    var curName = wx.getStorageSync('name') || '新鲜蔬菜';
    var id = wx.getStorageSync('id') || 'a0';
    var index = wx.getStorageSync('index') || 0;
    vm.setData({
      curIndex: index,
      curName: curName,
      id: id
    })
    // console.log("传入id",index)
    wx.removeStorageSync('id');
    wx.removeStorageSync('index');
    wx.removeStorageSync('name');
    //获取第一个列表
    tools.request(app.globalData.url + "/goods/Category_Vegetable", 'post', { 'class': vm.data.curName, 'city': app.globalData.city })
      .then(resp => {
        console.log("收到服务器回复", resp.data.data)
        var dic = {};
        for (var a = 0; a < resp.data.data.rightcategory.length; a++) {
          dic[resp.data.data.rightcategory[a].vegetables_category_varname] = resp.data.data.rightcategory[a].vegetables_category_name
        }
        vm.setData({
          rightcategory: resp.data.data.rightcategory,
          rightitem: resp.data.data.rightitem,
          dic: dic
        })
      })

  }
})