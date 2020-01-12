// pages/home/address/address.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var app = getApp();
Page({
  data: {
    district:'',
    poi:[],
    citys:[],
    tag1:true,
    tag2:true,
    search:[]
  },

  onLoad: function (options) {
    this.setData({
      citys: app.globalData.citys
    })
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'FLCBZ-INY3R-UNUWK-WWODA-VYWVV-XZFPN'
    });
  },
  /* 取消 */
  cancle: function(e){
    this.setData({
      tag2: true
    })
  },
  /* 选择查询到的地址 */
  clicksearchaddress: function (e){
    console.log(e.currentTarget.dataset.district)
    //为上一个页面的data赋值
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    if (prevPage.__route__ == 'pages/home/home') {
      console.log("为上一个页面的district赋值")
      prevPage.setData({
        district: e.currentTarget.dataset.district
      })
      app.globalData.city = e.currentTarget.dataset.district;
      wx.navigateBack({
        delta: 1
      })
    } else if (prevPage.__route__ == 'pages/me/address/add-address/add-address') {
      console.log("为add-address页面的address赋值")
      prevPage.setData({
        address: e.currentTarget.dataset.address + e.currentTarget.dataset.title
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  //点击任意处隐藏tag1
  clicktag: function(e){
      this.setData({
        tag1: true
    })
  },
  //地址搜索
  search: function(e){
    var vm = this
    console.log(e.detail.value);
    qqmapsdk.search({
      keyword: e.detail.value,  //搜索关键词
      region: location,
      filter: 'category<>%E5%85%AC%E4%BA%A4%E8%BD%A6%E7%AB%99',
      success: function (res) {
        console.log(res)
        //查到的地址信息存入search中，显示出来
        vm.setData({
          search:res.data,
          tag2: false
        })
      }
    })
  },
  //下拉城市列表
  clickdist: function (e){
    if (this.data.tag1 === true) {
      this.setData({
        tag1: false
      })
    } else {
      this.setData({
        tag1: true
      })
    }
  },
  //重新定位
  clickreset: function (e){
    this.getLocal();
    wx.showLoading({
      title: '正在重新定位',
    })
  },
  //选择了附近地址返回主页，传入地址
  choosedistrict: function (e){
    console.log(e.currentTarget.dataset.district);
    //为上一个页面的data赋值
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    if (prevPage.__route__ == 'pages/home/home') {
      console.log("为上一个页面的district赋值")
      prevPage.setData({
        district: e.currentTarget.dataset.district
      })
      app.globalData.city = e.currentTarget.dataset.district;
      wx.navigateBack({
        delta: 1
      })
    } else if (prevPage.__route__ == 'pages/me/address/add-address/add-address') {
      console.log("为add-address页面的address赋值") 
      prevPage.setData({
        address: e.currentTarget.dataset.address + e.currentTarget.dataset.title
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  onShow: function (options){
    this.getLocal();
  },
  //获取地址信息
  getLocal: function(){
    let vm = this;
    wx.showLoading({
      title: '定位中',
    })
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function (res) {
        console.log("wx.getLocation.......");
        console.log(res);
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          get_poi: 1,
          poi_options:'policy=2',
          success: function (res) {
            wx.hideLoading();
            console.log(res);
            vm.setData({
              district: res.result.address_component.city,
              poi: res.result.pois
            })
          },
          fail: function (res) {
            wx.hideLoading();
            console.log('获取定位信息失败');
          }
        })
      },
    })
  }
})