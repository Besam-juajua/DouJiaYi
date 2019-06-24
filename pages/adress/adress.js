const app = getApp();
const win = require("../../utils/win.js");

Page({
  data: {
    addressList: [],
  },
  onLoad(options) {
    if(options.origin == "order") {
      win.nlog("请设置默认收货地址~");
    }
    this.getList();
  },
  onShow() {
    console.log(">>>>默认地址", wx.getStorageSync("default_address"))
  },
  // 获取地址列表
  getList() {
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
  // 去编辑
  goEdit(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/editAdress/editAdress?type=' + data.type + "&id=" + data.id + "&name=" + data.name + "&phone=" + data.phone + "&address=" + data.address + "&detail=" + data.detail,
    })
  },
  // 刷新列表
  refreshAddress() {
    console.log(">>>>>>refreshAddress")
    this.getList();
  }
})