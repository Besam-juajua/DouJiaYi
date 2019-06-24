const app = getApp();
const win = require('../../utils/win.js');

Page({
  data: {
    imgUrl: app.imgUrl,
    userinfo: app.globalData.userinfo
  },
  onShow() {
    console.log(app.globalData.userinfo)
  },
  goMyOrder(e) {
    wx.navigateTo({
      url: '/pages/myOrder/myOrder?type=' + e.currentTarget.dataset.type
    })
  },
  goMessage() {
    wx.navigateTo({
      url: '/pages/message/message'
    })
  },
  goAdress() {
    wx.navigateTo({
      url: '/pages/adress/adress'
    })
  },
  goHelp() {
    wx.navigateTo({
      url: '/pages/help/help'
    })
  },
  goAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },
  goFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    })
  },
  call(e) {
    wx.makePhoneCall({
      phoneNumber: "400548952",
      fail: (res) => {
        win.nlog("电话唤起失败~");
      }
    })
  }
})