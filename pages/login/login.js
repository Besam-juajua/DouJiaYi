const app = getApp();
const win = require("../../utils/win.js");

Page({
  data: {
    user: "",
    pwd: "",
  },
  inputUser(e) {
    this.setData({
      user: e.detail.value
    })
  },
  inputPwd(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  postLogin() {
    wx.request({
      url: app.reqUrl + 'mini.busi_login',
      method: "POST",
      data: {
        account: this.data.user,
        password: this.data.pwd
      },
      success: (res) => {
        if(res.data.errcode != 0) {
          win.nlog(res.data.description);
          return;
        };
        wx.setStorage({
          key: 'token',
          data: res.data.token,
        });
        wx.setStorage({
          key: 'userinfo',
          data: res.data.userinfo,
        })
        app.globalData.token = res.data.token;
        app.globalData.userinfo = res.data.userinfo;
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  }
})