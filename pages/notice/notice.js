const app = getApp();
const win = require("../../utils/win.js");
const format = require("../../utils/util.js");

// 分页数据
function getList(self, isReload = false) {
  let page = isReload ? 0 : self.data.page;
  let list = isReload ? [] : self.data.noticeList;
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
      if (msgs && !isReload && msgs.length == 0) return;
      msgs = msgs.map(val => {
        val.createDate = format.formatTime(new Date(val.createDate));
        val.all = false;
        return val;
      })
      list = list.concat(msgs);
      self.setData({
        page: page + 1,
        noticeList: list
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
    page: 0,
    noticeList: []
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
  lookAll(e) {
    let index = e.currentTarget.dataset.index;
    let notice = "noticeList[" + index + "].all"
    this.setData({
      [notice]: !this.data.noticeList[index].all
    })
  }
})