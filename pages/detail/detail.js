const app = getApp();
const win = require("../../utils/win.js");
const format = require("../../utils/util.js");

Page({
  data: {
    imgUrl: app.imgUrl,
    order: {
      storeName: "梅江碧桂园加盟店包点1号店",
      productList: [{
        thumb: "/images/test.png",
        title: "豆加壹45g黄糖笑包",
        specs: "45g*12个",
        count: 2,
        money: "99.00"
      }, {
        thumb: "/images/test.png",
        title: "豆加壹45g黄糖笑包",
        specs: "45g*12个",
        count: 2,
        money: "99.00"
      }]
    }
  },
  onLoad(options) {
    this.getDetail(options.id);
  },
  // 获取详情数据
  getDetail(id) {
    wx.request({
      url: app.reqUrl + 'mini.order_info',
      header: {
        "x-access-token": app.globalData.token
      },
      data: {
        id: id
      },
      success: (res) => {
        if (res.data.errcode != 0) {
          win.nlog(res.description);
          return;
        }
        let info = res.data.orderInfo;
        info.createDate = format.formatTime(new Date(info.createDate));
        this.setData({
          order: info
        })
      }
    })
  }
})