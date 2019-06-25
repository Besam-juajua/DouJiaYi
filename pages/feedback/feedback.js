const app = getApp();
const win = require("../../utils/win.js");

Page({
  data: {
    content: ""
  },
  getContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  feedback() {
    win.loading("正在提交评价...");
    wx.request({
      url: app.reqUrl + 'mini.feedback',
      method: "POST",
      header: {
        "x-access-token": app.globalData.token
      },
      data: {
        content: this.data.content
      },
      success: (res) => {
        win.hideLoading();
        if(res.data.errcode != 0) {
          win.nlog(res.description);
          return;
        }
        win.nlog("评价成功!");
        setTimeout(() => {
          wx.navigateBack();
        }, 500)
      },
      fail: () => {
        win.hideLoading();
        win.nlog("网络错误");
      }
    })
  }
})