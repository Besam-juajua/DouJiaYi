const app = getApp();
const win = require("../../utils/win.js");

// 分页数据
function getList(self, isReload = false) {
  let page = isReload ? 0 : self.data.page;
  let list = isReload ? [] : self.data.orderList;
  wx.request({
    url: app.reqUrl + "mini.sysMsgs",
    header: {
      "x-access-token": app.globalData.token
    },
    data: {
      page: page + 1
    },
    success(res) {
      console.log("message",res);
      if (res.data.errcode != 0) {
        win.nlog(res.description);
        return;
      }
      if (res.data.msgs && res.data.msgs.length == 0) return;
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
    messageList: [{
      title: "最高8元电影红包等你拿",
      thumb: "/images/test.png",
      content: "国庆黄金档，淘票票最高8元电影红包等你拿，千万补贴速抢。",
      date: "2018-12-24  14:45"
    }, {
      title: "最高8元电影红包等你拿",
      thumb: "/images/test.png",
      content: "国庆黄金档，淘票票最高8元电影红包等你拿，千万补贴速抢。",
      date: "2018-12-24  14:45"
    }]
  },
  onLoad(options) {
    getList(this, true);
  },
  onPullDownRefresh() {
    getList(this, true);
  },
  onReachBottom() {
    getList(this);
  },
})