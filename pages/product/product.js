const app = getApp();
const win = require("../../utils/win.js");

Page({
  data: {
    imgUrl: app.imgUrl,
    page: 0,
    currentNav: 0,
    productList: [],
  },
  onLoad() {
    if (app.notLogin()) return;
    this.getLabels();
  },
  // 产品册获取标签
  getLabels() {
    wx.request({
      url: app.reqUrl + 'mini.labels',
      method: "GET",
      header: {
        'x-access-token': app.globalData.token
      },
      success: (res) => {
        if (res.data.errcode != 0) {
          win.nlog(res.data.description);
          return;
        }
        let products = [];
        res.data.labels.forEach((val, index) => {
          let item = {};
          item.label = val;
          if (index == 0) {
            item.value = res.data.goods;
          } else {
            item.value = [];
          }
          products.push(item);
        })
        this.setData({
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
  // 根据label获取列表 //////// 接口报错了
  getList(labelId, index) {
    if (this.data.productList[index].value && this.data.productList[index].value.length != 0) return;
    wx.request({
      url: app.reqUrl + 'mini.goods_list',
      method: "GET",
      header: {
        'x-access-token': app.globalData.token
      },
      data: {
        label: labelId
      },
      success: (res) => {
        if (res.data.errcode != 0) {
          win.nlog(res.data.description);
          return;
        }

        let item = "productList[" + index + "].value"
        this.setData({
          [item]: res.data.goods
        })
      }

    })
  },
  // setCount(e) {
  //   let item = "productList[" + this.data.currentNav + "].value[" + e.currentTarget.dataset.index + "].count"
  //   this.setData({
  //     [item]: e.detail.value,
  //   })
  // },
  // subCount(e) {
  //   if (this.data.productList[this.data.currentNav].value[e.currentTarget.dataset.index].count <= 0) return;
  //   let item = "productList[" + this.data.currentNav + "].value[" + e.currentTarget.dataset.index + "].count"
  //   this.setData({
  //     [item]: this.data.productList[this.data.currentNav].value[e.currentTarget.dataset.index].count - 1
  //   })
  // },
  // addCount(e) {
  //   if (this.data.productList[this.data.currentNav].value[e.currentTarget.dataset.index].count >= 99) return;
  //   let item = "productList[" + this.data.currentNav + "].value[" + e.currentTarget.dataset.index + "].count"
  //   this.setData({
  //     [item]: this.data.productList[this.data.currentNav].value[e.currentTarget.dataset.index].count + 1
  //   })
  // },
  // addProduct(labelIndex, stockIndex, count) {
  //   let item = "productList[" + labelIndex + "].value[" + stockIndex + "].count"
  //   this.setData({
  //     [item]: count
  //   })
  // },
  // 输入框input失去焦点
  // stopInput(e) {
  //   if (e.detail.value) return;
  //   let item = "productList[" + this.data.currentNav + "].value[" + e.currentTarget.dataset.index + "].count"
  //   this.setData({
  //     [item]: 0
  //   })
  // },
  goProductDetail(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?id=' + data.id,
    })
  },
  // goSetOrder() {
  //   let allBuy = [];
  //   let productList = this.data.productList;
  //   for (let i = 0; i < productList.length; i++) {
  //     for (let j = 0; j < productList[i].value.length; j++) {
  //       if (productList[i].value[j].count > 0) {
  //         let product = {
  //           gid: productList[i].value[j].gid._id,
  //           gspec: productList[i].value[j].gspec,
  //           count: productList[i].value[j].count
  //         }
  //         allBuy.push(product);
  //         let alterProduct = "productList[" + i + "].value[" + j + "].count"
  //         this.setData({
  //           [alterProduct]: 0
  //         })
  //       }
  //     }
  //   }
  //   wx.request({
  //     url: app.reqUrl + 'mini.stocks_add',
  //     method: "POST",
  //     header: {
  //       "x-access-token": app.globalData.token
  //     },
  //     data: {
  //       stocks: JSON.stringify(allBuy)
  //     },
  //     success: (res) => {
  //       if (res.data.errcode != 0) {
  //         win.nlog(res.data.description);
  //         return;
  //       }
  //       win.toast("下单成功!", 500);
  //       app.globalData.refreshOrder = true;
  //       setTimeout(() => {
  //         wx.switchTab({
  //           url: '/pages/order/order',
  //         })
  //       }, 500);
  //     }
  //   })
  // }
})