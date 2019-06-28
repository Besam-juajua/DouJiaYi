const app = getApp();
const win = require("../../utils/win.js");

Page({
  data: {
    addressList: [],
    origin: "",
  },
  onLoad(options) {
    if(options.origin == "order") {
      // win.nlog("请设置默认收货地址~");
      this.setData({
        origin: "order"
      })
    }
    win.loading("正在加载...");
    this.getList();
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
        win.hideLoading();
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
      url: '/pages/editAdress/editAdress?type=' + data.type + "&id=" + data.id + "&name=" + data.name + "&phone=" + data.phone + "&address=" + data.address + "&detail=" + data.detail + "&isDefault=" + data.default,
    })
  },
  // 刷新列表
  refreshAddress() {
    this.getList();
  },
  // 选择收货地址
  select(e) {
    if(!this.data.origin) return;
    let index = e.currentTarget.dataset.index;
    let select = this.data.addressList[index];
    let pages = getCurrentPages();
    let pre = pages[pages.length - 2];
    pre.setData({
      addrId: select._id,
      tempSelect: {
        name: select.username,
        phone: select.mobile,
        address: select.address,
        scopeAddress: select.detail,
      }
    })
    wx.navigateBack()
  }
})