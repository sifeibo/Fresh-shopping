
//封装request方法
const request = (url, method, data) => {
  var promise = new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中'
    })
    console.log(getApp().globalData.cookie);
    //网络请求
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.cookie
      },
      success: function (res) {
        //服务器返回数据
        wx.hideLoading()
        if (res.statusCode == 200) {
          wx.showToast({
            title: '加载成功'
          })
          resolve(res);
        } else {
          //返回错误提示信息
          reject(res.data);
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '无法连接服务器',
          icon: 'loading',
          duration: 1000
        })
        reject('网络出错');
      },

    });
  });
  return promise;
}



module.exports = {
  request:request
}