//app.js
App({
  reqUrl: "https://www.doujiayi.com/?action=",
  imgUrl: "https://www.doujiayi.com",
  imgPath: "https://www.doujiayi.com",
  onLaunch: function (options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
    this.globalData.token = wx.getStorageSync("token");
    this.globalData.userinfo = wx.getStorageSync("userinfo");
  },
  notLogin() {
    if(!this.globalData.token) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return true;
    }
  },
  globalData: {
    userinfo: null,
    token: "",
    addressId: "", // 用户选择的收货地址
    refreshOrder: false, // 刷新下单页面
  }
})