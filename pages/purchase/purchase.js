const app = getApp();
const win = require("../../utils/win.js");

Page({
  data: {
    imgUrl: app.imgUrl,
    page: 0,
    currentNav: 0,
    productList: []
  },
  onLoad() {
    if (app.notLogin()) return;
    wx.request({
      url: app.reqUrl + 'mini.labels',
      method: "GET",
      header: {
        'x-access-token': app.globalData.token
      },
      success: (res) => {
        console.log("采购表:", res)
        if (res.data.errcode != 0) {
          win.nlog(res.data.description);
          return;
        }
        let products = [];
        res.data.labels.forEach((val, index) => {
          let item = {};
          item.label = val;
          if(index == 0) {
            item.value = res.data.stocks;
          } else {
            item.value = [];
          }
          products.push(item);
        })
        this.setData({
          // labels: res.data.labels,
          productList: products
        })
      }
    })
  },
  switchNav(e) {
    let dataset = e.target.dataset;
    if (typeof dataset.index == "undefined") return;
    this.setData({
      currentNav: dataset.index
    })
    this.getList(dataset.id, dataset.index);
  },
  // 根据label获取列表
  getList(labelId, index) {
    if (this.data.productList[index].value.length != 0) return;
    wx.request({
      url: app.reqUrl + 'mini.stock_bylabel',
      method: "GET",
      header: {
        'x-access-token': app.globalData.token
      },
      data: {
        labelId: labelId
      },
      success: (res) => {
        console.log("采购列表", res);
        if (res.data.errcode != 0) {
          win.nlog(res.data.description);
          return;
        }
        let item = "productList[" + index + "].value"
        this.setData({
          [item]: res.data.stocks
        })
      }

    })
  },
  subCount(e) {
    if (this.data.productList[this.data.currentNav].value[e.currentTarget.dataset.index].count <= 0) return;
    let item = "productList[" + this.data.currentNav + "].value[" + e.currentTarget.dataset.index + "].count"
    this.setData({
      [item]: this.data.productList[this.data.currentNav].value[e.currentTarget.dataset.index].count - 1
    })
  },
  addCount(e) {
    if (this.data.productList[this.data.currentNav].value[e.currentTarget.dataset.index].count >= 99) return;
    let item = "productList[" + this.data.currentNav + "].value[" + e.currentTarget.dataset.index + "].count"
    this.setData({
      [item]: this.data.productList[this.data.currentNav].value[e.currentTarget.dataset.index].count + 1
    })
  },
  addProduct(labelIndex, stockIndex, count) {
    let item = "productList[" + labelIndex + "].value[" + stockIndex + "].count"
    this.setData({
      [item]: count
    })
    // this.data.productList.findIndex(val => {
    //   val.label
    // })
  },
  goProductDetail(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?origin=purchase&labelIndex=' + this.data.currentNav + '&stockIndex=' + data.stockindex + '&id=' + data.id,
    })
  },
  goSetOrder() {
    wx.navigateTo({
      url: '/pages/setOrder/setOrder',
    })
  }
})