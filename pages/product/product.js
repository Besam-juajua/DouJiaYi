const app = getApp();
const win = require("../../utils/win.js")

// 分页数据
function getList(self, isReload = false) {
  let page = isReload ? 0 : self.data.page;
  let list = isReload ? [] : self.data.productList;
  if(isReload) win.loading("正在加载");
  wx.request({
    url: app.reqUrl + "mini.goods_list",
    method: "GET",
    data: {
      page: page + 1
    },
    success(res) {
      if (res.data.errcode != 0) return;
      if (res.data.goods && res.data.goods.length == 0) return;
      list = res.data.goods;
      list = list.map(val => {
        val.count = 0;
        return val;
      })
      self.setData({
        page: page + 1,
        productList: list,
      })
    },
    fail(res) {
      win.nlog("当前网络不可用！")
    },
    complete() {
      wx.stopPullDownRefresh();
      if(isReload) win.hideLoading();
    }
  })
}

Page({
  data: {
    imgUrl: app.imgUrl,
    page: 0,
    productList: []
  },
  onLoad() {
    getList(this, true);
  },
  onPullDownRefresh() {
    getList(this, true);
  },
  onReachBottom() {
    getList(this);
  },
  goDetail(e) {
    if (app.notLogin()) return;
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id,
    })
  }
})