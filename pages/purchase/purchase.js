const app = getApp();
const win = require("../../utils/win.js");

Page({
  data: {
    imgUrl: app.imgUrl,
    page: 0,
    currentNav: 0,
    productList: [],
    totalPrice: 0,
    totalCount: 0, 
  },
  onShow() {
    if (app.notLogin()) return;
    this.getLabels();
  },
  // 获取标签
  getLabels() {
    wx.request({
      url: app.reqUrl + 'mini.stock_labels',
      method: "GET",
      header: {
        'x-access-token': app.globalData.token
      },
      success: (res) => {
        console.log("purchase res > ", res)
        if (res.data.errcode != 0) {
          win.nlog(res.data && res.data.description || "请求出错");
          return;
        }
        let products = [];
        res.data.labels.forEach((val, index) => {
          let item = {};
          item.label = val;
          if (index == 0) {
            item.value = res.data.stocks;
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
      url: app.reqUrl + 'mini.stock_bylabel',
      method: "GET",
      header: {
        'x-access-token': app.globalData.token
      },
      data: {
        label: labelId
      },
      success: (res) => {
        if (res.data.errcode != 0) {
          win.nlog(res.data.description || "请求出错");
          return;
        }
        
        let item = "productList[" + index + "].value"
        this.setData({
          [item]: res.data.stocks
        })
      }

    })
  },
  setCount(e) {
    let value = e.detail.value;
    let data = e.currentTarget.dataset;
    let good = this.data.productList[this.data.currentNav].value[data.index];
    let item = "productList[" + this.data.currentNav + "].value[" + data.index + "].count";
    let changeCount = e.detail.value - good.count;
    let changePrice = changeCount * good.gspec.price;
    this.setData({
      [item]: value,
      totalCount: this.data.totalCount + changeCount,
      totalPrice: +this.data.totalPrice + changePrice
    })
  },
  subCount(e) {
    let good = this.data.productList[this.data.currentNav].value[e.currentTarget.dataset.index];
    if (good.count <= 0) return;
    let item = "productList[" + this.data.currentNav + "].value[" + e.currentTarget.dataset.index + "].count"
    this.setData({
      [item]: good.count - 1,
      totalCount: this.data.totalCount - 1,
      totalPrice: +this.data.totalPrice - good.gspec.price
    })
  },
  addCount(e) {
    let good = this.data.productList[this.data.currentNav].value[e.currentTarget.dataset.index];
    if (good.count >= 99) return;
    let item = "productList[" + this.data.currentNav + "].value[" + e.currentTarget.dataset.index + "].count"
    this.setData({
      [item]: good.count + 1,
      totalCount: this.data.totalCount + 1,
      totalPrice: +this.data.totalPrice + good.gspec.price
    })
  },
  // 辅助productDetail页面，（由于改为onShow时访问labels,因此该功能暂时关闭）
  // addProduct(labelIndex, stockIndex, count) {
  //   let currentNav = this.data.currentNav;
  //   let good = this.data.productList[labelIndex].value[stockIndex];
  //   let changeCount = count - good.count;
  //   let changePrice = changeCount * good.gspec.price
  //   let item = "productList[" + labelIndex + "].value[" + stockIndex + "].count"
  //   this.setData({
  //     [item]: count,
  //     totalCount: this.data.totalCount + changeCount,
  //     totalPrice: this.data.totalPrice + changePrice
  //   })
  // },
  // 输入框input失去焦点
  stopInput(e) {
    let value = e.detail.value;
    if(value && !isNaN(value) && value >= 1) return;
    let item = "productList[" + this.data.currentNav + "].value[" + e.currentTarget.dataset.index + "].count"
    this.setData({
      [item]: 0
    })
  },
  goProductDetail(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?origin=purchase&labelIndex=' + this.data.currentNav + '&stockIndex=' + data.stockindex + "&spec=" + data.spec + '&price=' + data.price + '&id=' + data.id,
    })
  },
  // 立即下单
  goSetOrder() {
    let allBuy = [];
    let productList = this.data.productList;
    for (let i = 0; i < productList.length; i++) {
      for (let j = 0; j < productList[i].value.length; j++) {
        let item = productList[i].value[j];
        if (item.count > 0) {
          let product = {
            gid: item.gid._id,
            gspec: item.gspec,
            count: item.count
          }
          allBuy.push(product);
          let alterProduct = "productList[" + i + "].value[" + j + "].count"
          this.setData({
            [alterProduct]: 0,
            // totalPrice: this.data.totalPrice - item.gspec.price * item.count,
            // totalCount: this.data.totalCount - item.count
          })
        }
      }
    }
    if(allBuy.length == 0) {
      wx.showToast({
        title: '请选择商品数量',
        icon: "none",
        duration: 1000
      })
      return;
    }
    wx.request({
      url: app.reqUrl + 'mini.stocks_add',
      method: "POST",
      header: {
        "x-access-token": app.globalData.token
      },
      data: {
        stocks: JSON.stringify(allBuy)
      },
      success: (res) => {
        if (res.data.errcode != 0) {
          win.nlog(res.data.description);
          return;
        }
        win.toast("下单成功!", 500);
        app.globalData.refreshOrder = true;
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/order/order',
          })
        }, 500);
        this.setData({
          totalCount: 0,
          totalPrice: "0.00"
        })
      }
    })
  }
})