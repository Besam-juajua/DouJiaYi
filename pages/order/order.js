const app = getApp();

// 分页数据
function getList(self, isReload = false) {
  let page = isReload ? 0 : self.data.page;
  let list = isReload ? [] : self.data.orderList;
  wx.request({
    url: app.reqUrl + "mini.cart_list",
    method: "GET",
    data: {
      page: page + 1
    },
    success(res) {
      console.log("下单表><>:",res)
      if (res.data.errcode != 0) return;
      if (res.data.goods && res.data.goods.length == 0) return;
      list = res.data.goods;
      list = list.map(val => {
        val.count = 0;
        return val;
      })
      page += 1;
      console.log("><> ", list);
      self.setData({
        page: page,
        // orderList: list,
      })
    },
    fail(res) {
      wx.showToast({
        title: '当前网络不可用！',
      })
    },
    complete() {
      wx.showToast({
        title: '刷新成功',
        icon: "none"
      })
      wx.stopPullDownRefresh();
    }
  })
}

Page({
  data: {
    imgUrl: app.imgUrl,
    page: 0,
    orderList: [{
      thumb: "/images/test.png",
      title: "豆加壹45g黄糖笑包",
      specs: "45g * 12个",
      price: "4.20",
      count: 2
    }, {
      thumb: "/images/test.png",
      title: "豆加壹45g黄糖笑包",
      specs: "45g * 12个",
      price: "4.20",
      count: 2
    }, {
      thumb: "/images/test.png",
      title: "豆加壹45g黄糖笑包",
      specs: "45g * 12个",
      price: "4.20",
      count: 2
    }, {
      thumb: "/images/test.png",
      title: "豆加壹45g黄糖笑包",
      specs: "45g * 12个",
      price: "4.20",
      count: 2
    }, {
      thumb: "/images/test.png",
      title: "豆加壹45g黄糖笑包",
      specs: "45g * 12个",
      price: "4.20",
      count: 2
    }, ]
  },
  onLoad() {
    getList(this, true);
  },
  onPullDownRefresh() {
    getList(this, true);
  },
  subCount(e) {
    let index = e.currentTarget.dataset.index;
    let item = "orderList[" + index + "].count"
    if(this.data.orderList[index].count <= 0) return;
    this.setData({
      [item]: this.data.orderList[index].count - 1
    })
  },
  addCount(e) {
    let index = e.currentTarget.dataset.index;
    let item = "orderList[" + index + "].count"
    if(this.data.orderList[index].count >= 99) return;
    this.setData({
      [item]: this.data.orderList[index].count + 1
    })
  },
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id,
    })
  }
})