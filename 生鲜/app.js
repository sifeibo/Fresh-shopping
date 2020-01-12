//app.js
const tools = require('/utils/tools.js')
App({
  onLaunch:function(){
    let vm = this;
    //登录信息
    wx.login({
      success: function (res) {
        var code = res.code
        console.log("登录code", code)
        tools.request(vm.globalData.url + "/info/login", 'post', { 'code': code })
          .then(resp => {
            console.log("收到服务器回复",resp)
            vm.globalData.userInfo = resp.data;
            vm.globalData.cookie = resp.header["Set-Cookie"]
          })
      }
    })
    // //获取定位授权
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userLocation']) {
    //       wx.authorize({
    //         scope: 'scope.userLocation',
    //         success(res) {
    //           // 用户已经同意小程序使用定位功能，后续调用 wx.getLocation 接口不会弹窗询问
    //           console.log("授权成功!",res)
    //         },
    //         fail(){
    //           vm.globalData.shouquanstate=false;
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    shouquanstate:true,
    userInfo: null,
    citys:[],
    city:'',
    cookie:'',
    url: 'http://10.18.45.65:8080',
  }
})