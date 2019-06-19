const app = getApp();
const win = require("../../utils/win.js");

// 分页数据
function getList(self, isReload = false) {
  let page = isReload ? 0 : self.data.page;
  let list = isReload ? [] : self.data.orderList;
  let count = isReload? 0 : self.data.totalCount;
  let price = isReload? 0 : self.data.totalPrice;
  wx.request({
    url: app.reqUrl + "mini.cart_list",
    header: {
      "x-access-token": app.globalData.token
    },
    data: {
      page: page + 1
    },
    success(res) {
      if (res.data.errcode != 0) {
        win.nlog(res.description);
        return;
      }
      if (res.data.carts && res.data.carts.length == 0) return;
      list = res.data.carts;
      let totalCount = 0;
      let totalPrice = 0;
      list.forEach(val => {
        totalCount += val.count
        totalPrice += val.count * val.gspec.price;
      })
      page += 1;
      self.setData({
        page: page,
        orderList: list,
        totalCount: count + totalCount,
        totalPrice: price + totalPrice
      })
    },
    fail(res) {
      wx.showToast({
        title: '当前网络不可用！',
      })
    },
    complete(res) {
      wx.stopPullDownRefresh();
    }
  })
}

Page({
  data: {
    imgUrl: app.imgUrl,
    page: 0,
    totalCount: 0, // 总个数
    totalPrice: 0, // 总价格
    orderList: []
  },
  onLoad() {
    getList(this, true);
  },
  onPullDownRefresh() {
    getList(this, true);
  },
  subCount(e) {
    let data = e.currentTarget.dataset
    let index = data.index;
    let item = "orderList[" + index + "].count"
    if(this.data.orderList[index].count <= 0) return;
    this.setData({
      [item]: this.data.orderList[index].count - 1,
      totalCount: this.data.totalCount - 1,
      totalPrice: this.data.totalPrice - data.price
    })
    this.alterCount(data.id, index);
  },
  addCount(e) {
    let data = e.currentTarget.dataset
    let index = data.index;
    let item = "orderList[" + index + "].count"
    if(this.data.orderList[index].count >= 99) return;
    this.setData({
      [item]: this.data.orderList[index].count + 1,
      totalCount: this.data.totalCount + 1,
      totalPrice: this.data.totalPrice + data.price
    })
    this.alterCount(data.id, index);
  },
  alterCount(id, index) {
    wx.request({
      url: app.reqUrl + 'mini.cart_calcu',
      header: {
        "x-access-token": app.globalData.token
      },
      data: {
        id: id,
        count: this.data.orderList[index].count
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
  goDetail(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?origin=order&id=' + data.id + "&stockIndex=" + data.index,
    })
  },
  // 这个是给productDetail调用的
  addProduct(index, count) {
    let order = this.data.orderList[index];
    let id = order._id;
    if (count > 99 || count < 0) return;
    let item = "orderList[" + index + "].count"
    this.setData({
      totalCount: this.data.totalCount + count - order.count,
      totalPrice: this.data.totalPrice + order.gspec.price * (count - order.count),
      [item]: count,
    })
    this.alterCount(id, index);
  },
  toPay(e) {
    wx.request({
      url: app.reqUrl + 'mini.cart_add',
      header: {
        "x-access-token": app.globalData.token
      },
      data: {
        addrId: wx.getStorageSync("default_address"),
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
})