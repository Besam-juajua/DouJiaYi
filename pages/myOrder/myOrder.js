const app = getApp();
const win = require("../../utils/win.js");
const format = require("../../utils/util.js");

// 分页数据
function getList(self, isReload = false) {
  let page = isReload ? 0 : self.data.page;
  let list = isReload ? [] : self.data.orderList;
  wx.request({
    url: app.reqUrl + "mini.order_list",
    header: {
      "x-access-token": app.globalData.token
    },
    data: {
      page: page + 1,
      status: self.data.currentNav
    },
    success(res) {
      if (res.data.errcode != 0) {
        win.nlog(res.description);
        return;
      }
      if (res.data.order_list && res.data.order_list.length == 0) {
        win.nlog("暂无更多数据");
        self.setData({
          hasMore: false
        })
        return;
      }
      list = res.data.order_list;
      list.forEach((val, index) => {
        list[index].createDate = format.formatTime(new Date(val.createDate));
        list[index].all = false;
      })
      self.setData({
        page: page + 1,
        orderList: list,
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
    currentNav: 0, // 当前选中的导航 nav
    page: 0,
    hasMore: true, // 分页是否有更多数据
    orderList: []
  },
  onLoad(options) {
    let type = options.type;
    if(type) {
      this.setData({
        currentNav: type
      })
    }
    getList(this, true);
  },
  onPullDownRefresh() {
    getList(this, true);
  },
  onReachBottom() {
    if(this.data.hasMore) {
      getList(this);
    }
  },
  switchNav(e) {
    this.setData({
      currentNav: e.currentTarget.dataset.nav || e.arget.dataset.nav,
      orderList: [],
      hasMore: true,
    })
    getList(this, true);
  },
  // 取消订单
  cancelOrder(e) {
    win.loading("取消中...");
    let index = e.target.dataset.index;
    wx.request({
      url: app.reqUrl + 'mini.order_del',
      header: {
        "x-access-token": app.globalData.token
      },
      data: {
        id: e.target.dataset.id
      },
      success: (res) => {
        if (res.data.errcode != 0) {
          win.nlog(res.description);
          return;
        }
        let list = this.data.orderList;
        list.splice(index, 1);
        this.setData({
          orderList: list
        })
      },
      complete: () => {
        win.hideLoading();
      }
    })
  },
  goProduct(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  goRemark() {
    if(this.data.currentNav != 2) return;
    wx.navigateTo({
      url: '/pages/remark/remark',
    })
  },
  // 是否查看全部
  lookAll(e) {
    let index = e.currentTarget.dataset.index;
    let order = "orderList[" + index + "].all"
    this.setData({
      [order]: !this.data.orderList[index].all
    })
  }
})