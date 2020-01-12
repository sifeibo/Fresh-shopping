// pages/home/home.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const tools = require('../../utils/tools.js')
var qqmapsdk;
var app=getApp()
Page({
  //数据绑定
  data: {
    swiperImgs: [
      {
        img: '../../images/lunbo/swiper-1.jpg'
      },
      {
        img: '../../images/lunbo/swiper-2.jpg'
      }
    ],
    buttonList: [
      { img: "/images/button/1.jpg", name: '新鲜蔬菜', id: 'a0' },
      { img: "/images/button/3.jpg", name: '海鲜水产', id: 'a1'},
      { img: "/images/button/6.jpg", name: '新鲜水果', id: 'a2'},
      { img: "/images/button/2.jpg", name: '乳品面包', id: 'a3'},
      { img: "/images/button/4.jpg", name: '粮油调味', id: 'a4'},
      { img: "/images/button/5.jpg", name: '酒水饮料', id: 'a5' },
      { img: "/images/button/6.jpg", name: '休闲零食', id: 'a6'},
      { img: "/images/button/6.jpg", name: '冷藏冻品', id: 'a7' },
      { img: "/images/button/6.jpg", name: '厨房用品', id: 'a8'},
      { img: "/images/button/6.jpg", name: '肉禽蛋类', id: 'a9'},
    ],
    //地区名字
    district:null,
    //可以供货的城市
    citys:[],
    //标识是否在供货地区,0不在，1在
    tag: false,
    qianggou:[],
    love:[]
  },
  //进入商品详情
  intodetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var list = {
      id: e.currentTarget.dataset.id,
      name: e.currentTarget.dataset.name,
      image: e.currentTarget.dataset.image,
      price: e.currentTarget.dataset.price,
      jieshao: e.currentTarget.dataset.jieshao,
      danwei: e.currentTarget.dataset.danwei,
      class: e.currentTarget.dataset.class
    }
    list = JSON.stringify(list)
    list = encodeURIComponent(list)
    wx.navigateTo({
      url: '/pages/list/list-detail/list-detail?list=' + list
    })
  },
  //加号
  clickgoods: function (e) {
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
  },
  // 跳转到list
  clickbutton: function(e){
    var index = e.currentTarget.dataset.index;
    var name =  e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    console.log(name)
    wx.setStorageSync('name', name);
    wx.setStorageSync('id', id);
    wx.setStorageSync('index', index);
    wx.switchTab({
      url: '/pages/list/list',
    })
  },
  // 跳转入定位
  dingwei: function (e){
    wx.navigateTo({
      url: '/pages/home/address/address',
    })
  },
  // 搜索商品
  search: function (e) {
    wx.navigateTo({
      url: '/pages/home/search/search',
    });
  },
  //地址管理
  address: function (e) {
    wx.navigateTo({
      url: '/pages/home/address/address',
    })
  },
  //页面刷新
  onShow: function (options){
    var vm = this;
    //判断地区名是否存在于可以供货的城市
    vm.setData({
      tag: false
    })
    if (vm.data.district!=null){
      var citys = vm.data.citys;
      for (var i = 0; i < citys.length; i++) {
        if (vm.data.district == citys[i]) {
          vm.setData({
            tag: true
          })
        }
      }
    // //获取今日特价菜品
    // tools.request(app.globalData.url + "/goods/Category_Vegetable", 'post', { 'class': '限时抢购', 'city': vm.data.district })
    //   .then(resp => {
    //     console.log("限时抢购", resp)
    //     vm.setData({
    //       qianggou:resp.data.data.rightitem.xianshi
    //     })
    //   })
    // //获取猜你喜欢菜品
    // tools.request(app.globalData.url + "/goods/Guessyoulike", 'post', { 'city': vm.data.district })
    //   .then(resp => {
    //     console.log("猜你喜欢", resp)
    //     vm.setData({
    //       love: resp.data.data
    //     })
    //   })
    }
  },
  //页面加载
  onLoad: function (options) {
    var vm = this;
    //获取覆盖城市信息
    tools.request(app.globalData.url + "/goods/city", 'post', {})
      .then(resp => {
        console.log("收到服务器回复的城市信息", resp.data)
        var city = [];
        for (var a in resp.data) {
          city.push(resp.data[a].area_name)
        }
        vm.setData({
          citys: city
        })
        console.log(vm.data.citys)
        app.globalData.citys = city;
        //如果没有授权,就不显示页面
        qqmapsdk = new QQMapWX({
          key: 'FLCBZ-INY3R-UNUWK-WWODA-VYWVV-XZFPN'
        });
        vm.getLocation();
      })
  },
  //获取经纬度然后传入地图API
  getLocation: function(){
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function(res) {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        vm.getLocal(latitude, longitude)
      },
      fail: function(res){
        console.log('获取经纬度失败fail')
      }
    })
  },
  //获取当前地理位置
  getLocal: function (latitude, longitude){
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(res);
        vm.setData({
          district: res.result.address_component.city
        })
        //获取今日特价菜品
        tools.request(app.globalData.url + "/goods/Category_Vegetable", 'post', { 'class': '限时抢购', 'city': vm.data.district})
          .then(resp => {
            console.log("限时抢购", resp)
            vm.setData({
              qianggou: resp.data.data.rightitem.xianshi
            })
          })
        //获取猜你喜欢菜品
        tools.request(app.globalData.url + "/goods/Guessyoulike", 'post', {'city': vm.data.district})
          .then(resp => {
            console.log("猜你喜欢", resp)
            vm.setData({
              love: resp.data.data
            })
          })
        app.globalData.city = res.result.address_component.city;
        //判断地区名是否存在于可以供货的城市
        console.log("++++++++++++", vm.data.district)
        var citys = vm.data.citys;
        for (var i = 0; i < citys.length; i++) {
          if (vm.data.district === citys[i]) {
            vm.setData({
              tag: true
            })
          }
        }
      },
      fail: function (res) {
        console.log('获取API定位信息失败');
      }
    })
  }
})