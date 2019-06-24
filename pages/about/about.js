let wxParse = require("../../wxParse/wxParse.js");
const app = getApp();
const win = require("../../utils/util.js");

Page({
  data: {
    content: ""
  },
  onLoad() {
    this.aboutUs();
  },
  aboutUs() {
    wx.request({
      url: app.reqUrl + 'mini.about_us',
      header: {
        "x-access-token": app.globalData.token
      },
      success: (res) => {
        if (res.data.errcode != 0) {
          win.nlog("加载失败~");
          return;
        }
        // this.setData({
        //   content: res.data.content.content
        // })
        wxParse.wxParse('content', 'html', res.data.content.content, this, 5);
      }
    })
  }
})