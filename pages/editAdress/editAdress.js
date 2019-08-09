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
    isDefault: true,
    tempDefault: false, // 记录是否默认地址，以确定在保存时，是否清除本地storage
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
      scopeAddress: options.detail,
      isDefault: options.isDefault == "1",
      tempDefault: options.isDefault == "1"
    })
  },
  enterAddress(e) {
    this.setData({
      address: e.detail.value
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
  onAuthLocation() {
    wx.authorize({
      scope: 'scope.userLocation',
      success: (res) => {
        this.chooseLocation();
      }
    })
  },
  // 打开地图选择
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          address: res.address
        })
      }
    })
  },
  // 点击默认按钮
  changeSwitch() {
    this.setData({
      isDefault: !this.data.isDefault
    })
  },
  submitAddress() {
    if(!this.data.name || !this.data.phone || !this.data.address || !this.data.scopeAddress) {
      win.nlog("请继续完善信息");
      return;
    }
    win.loading("正在提交...");
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
          win.hideLoading();
          win.nlog(res.description);
          return;
        }
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
        pre.refreshAddress && pre.refreshAddress();
        if(this.data.isDefault) {
          wx.setStorage({
            key: 'default_address',
            data: default_address,
          })
        }
        win.hideLoading();
        win.nlog("提交成功");
        if(this.data.tempDefault && !this.data.isDefault) {
          wx.removeStorageSync("default_address")
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
        pre.refreshAddress && pre.refreshAddress();
        if(this.data.tempDefault) {
          wx.removeStorageSync("default_address")
        }
        setTimeout(() => {
          wx.navigateBack();
        }, 500)
      }
    })
  }
})