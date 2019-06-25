const app = getApp();
const win = require("../../utils/win.js")

Page({
  data: {
    isAdd: false,
    id: "",
    name: "",
    phone: "",
    address: "",
    scopeAddress: "",
    isDefault: true
  },
  onLoad(options) {
    if(options.type==1) {
      this.setData({
        isAdd: true
      })
      return;
    }
    this.setData({
      id: options.id,
      name: options.name,
      phone: options.phone,
      address: options.address,
      scopeAddress: options.detail
    })
  },
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getScope(e) {
    this.setData({
      scopeAddress: e.detail.value
    })
  },
  chooseAddress() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          address: res.address
        })
      }
    })
  },
  submitAddress() {
    if(!this.data.name || !this.data.phone || !this.data.address || !this.data.scopeAddress) {
      win.nlog("请继续完善信息");
      return;
    }
    wx.request({
      url: app.reqUrl + 'mini.address_operate',
      method: "POST",
      header: {
        "x-access-token": app.globalData.token
      },
      data: {
        id: this.data.id,
        username: this.data.name,
        mobile: this.data.phone,
        address: this.data.address,
        detail: this.data.scopeAddress,
        is_default: this.data.isDefault? 1 : 0
      },
      success: (res) => {
        if (res.data.errcode != 0) {
          win.nlog(res.description);
          return;
        }
        win.nlog("添加成功");
        let obj = {
          id: this.data.id,
          name: this.data.name,
          phone: this.data.phone,
          address: this.data.address,
          scopeAddress: this.data.scopeAddress,
        }
        let default_address = JSON.stringify(obj);
        let pages = getCurrentPages();
        let pre = pages[pages.length - 2];
        pre.refreshAddress();
        if(this.data.isDefault) {
          wx.setStorage({
            key: 'default_address',
            data: default_address,
          })
        }
        setTimeout(() => {
          wx.navigateBack();
        }, 500)
      }
    })
  },
  deleteAddress() {
    wx.request({
      url: app.reqUrl + 'mini.address_del',
      header: {
        "x-access-token": app.globalData.token
      },
      data: {
        id: this.data.id
      },
      success: (res) => {
        if (res.data.errcode != 0) {
          win.nlog("删除失败~");
          return;
        }
        win.nlog("删除成功")
        let pages = getCurrentPages();
        let pre = pages[pages.length - 2];
        pre.refreshAddress();
        setTimeout(() => {
          wx.navigateBack();
        }, 500)
      }
    })
  }
})