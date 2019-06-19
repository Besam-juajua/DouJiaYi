const app = getApp();
const win = require("../../utils/win.js");

Page({
  data: {
    addressList: [],
  },
  onLoad() {
    wx.request({
      url: app.reqUrl + 'mini.address_list',
      header: {
        "x-access-token": app.globalData.token
      },
      data: {
        page: 1
      },
      success: (res) => {
        console.log("地址列表>>>", res)
        if (res.data.errcode != 0) {
          win.nlog("地址加载失败~");
          return;
        }
        this.setData({
          addressList: res.data.addrs
        })
      }
    })
  },
  goEdit(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/editAdress/editAdress?type=' + data.type + "&id=" + data.id + "&name=" + data.name + "&phone=" + data.phone + "&detail=" + data.detail,
    })
  }
})