const app = getApp();
const win = require("../../utils/win.js");
const format = require("../../utils/util.js");

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
      if (res.data.errcode != 0) {
        win.nlog(res.description);
        return;
      }
      let msgs = res.data.msgs;
      if (msgs && msgs.length == 0) return;
      msgs = msgs.map(val => {
        val.createDate = format.formatTime(new Date(val.createDate));
        return val;
      })
      self.setData({
        page: page + 1,
        messageList: res.data.msgs,
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