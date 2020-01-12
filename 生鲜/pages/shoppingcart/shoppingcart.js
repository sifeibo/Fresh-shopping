// pages/shoppingcart/shoppingcart.js
Page({
  data: {
    selectAllStatus:true,
    // 商品列表数据
    list: null,
    // 金额
    totalPrice: 0, // 总价，初始为0
    // 全选状态
    selectAllStatus: false, // 全选状态，默认全选

  },
  onLoad: function (options) {
    // wx.removeStorageSync('goods_cart')
  },
  onShow: function (options){
    var list = wx.getStorageSync('goods_cart') || [];
    this.setData({
      list: list,
      selectAllStatus: false
    })
    // 价格方法
    this.count_price();
  },
  //结算按钮
  payFor: function(e){
    let list = this.data.list;
    let total = 0;
    let listselected = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].selected) {
        // listselected.push({
        //   name: list[i].name,
        //   danwei: list[i].danwei,
        //   num: list[i].num,
        //   price: list[i].price
        // })
        listselected.push(list[i])
      }
    }
    //判断是否有选中菜
    if (listselected.length != 0){
      // listselected = JSON.stringify(listselected)
      // console.log(listselected)
      wx.navigateTo({
        // url: '/pages/shoppingcart/pay/pay?list=' + listselected + "&totalprice=" + this.data.totalPrice,
        url: '/pages/shoppingcart/pay/pay?totalprice=' + this.data.totalPrice,
      })
    }
  },
  //全选按钮
  cilckall: function(e) {
    let selectAllStatus = this.data.selectAllStatus;
    // true  -----   false
    selectAllStatus = !selectAllStatus;
    // 获取商品数据
    let list = this.data.list;
    // 循环遍历判断列表中的数据是否选中
    for (let i = 0; i < list.length; i++) {
      list[i].selected = selectAllStatus;
    }
    // 页面重新渲染
    this.setData({
      selectAllStatus: selectAllStatus,
      list: list
    });
    wx.setStorageSync('goods_cart', list)
    // 计算金额方法
    this.count_price();
  },
  //当前商品选中事件
  selectList:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = that.data.list;
    // 默认全选
    that.data.selectAllStatus = true;
    // 循环数组数据，判断----选中/未选中[selected]
    list[index].selected = !list[index].selected;
    // 如果数组数据全部为selected[true],全选
    for (var i = list.length - 1; i >= 0; i--) {
      if (!list[i].selected) {
        that.data.selectAllStatus = false;
        break;
      }
    }
    // 重新渲染数据
    that.setData({
      list: list,
      selectAllStatus: that.data.selectAllStatus
    })
    wx.setStorageSync('goods_cart', list)
    // 调用计算金额方法
    that.count_price();
  },
  //增加
  btn_add: function (e) {
    // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // 获取商品数据
    let list = this.data.list;
    // 获取商品数量
    let num = list[index].num;
    // 点击递增
    num = num + 1;
    list[index].num = num;
    // 重新渲染 ---显示新的数量
    this.setData({
      list: list
    });
    wx.setStorageSync('goods_cart', list)
    // 计算金额方法
    this.count_price();
  },
  //减少
  btn_minus: function (e) {
    const index = e.currentTarget.dataset.index;
    // const obj = e.currentTarget.dataset.obj;
    // console.log(obj);
    // 获取商品数据
    let list = this.data.list;
    // 获取商品数量
    let num = list[index].num;
    // 判断num小于等于1  return; 点击无效
    if (num <= 1) {
      list.splice(index, 1)
      this.setData({
        list: list
      });
      this.count_price();
      wx.showToast({
        title: '删除成功！',
        icon: 'success',
        duration: 2000
      });
      wx.setStorageSync('goods_cart', list)
      return false;
    }
    // else  num大于1  点击减按钮  数量--
    num = num - 1;
    list[index].num = num;
    this.setData({
      list: list
    });
    wx.setStorageSync('goods_cart', list)
    this.count_price();
  },
  //计算价格
  count_price: function() {
    let list = this.data.list;
    let total = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < list.length; i++) {
      // 判断选中计算价格
      if (list[i].selected) {
        // 所有价格加起来 count_money
        total += list[i].num * list[i].price;
      }
    }
    this.setData({
      list: list,
      totalPrice: total.toFixed(2)
    });
  }
})