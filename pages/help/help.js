let wxParse = require("../../wxParse/wxParse.js");
let win = require("../../utils/win.js");
const app = getApp();

Page({
  data: {
    helpList: [{
      title: "A．可以先交付作品再付款吗？",
      content: "顶呱呱目前采用的是先付款后服务方式。订单采用派单模式，付款后您的专属顾问会尽快与您联系沟通事宜。"
    }, {
      title: "B．我刚刚下错了订单，该如何取消订单呢？",
      content: "服务项目未开始实施前可无理由取消订单，不收取任何费用项目开始实施后取消订单，将根据合同规定收取相关费用。"
    }, {
      title: "C．我已经下单了，但是想更換服务，会额外收取其他费用吗？",
      content: "服务项目未开始实施前可更换服务，不收取任何费用。项目开始实施后更换服务，将根据合同规定收取相关费用。"
    }, {
      title: "D．你们的服务时间已经超过协议规定时间了怎么办？",
      content: "协议规定时间内未满意交付，平台会按相应比例进行超时赔付。"
    }]
  },
  onLoad(options) {
    this.getList();
  },
  getList() {
    wx.request({
      url: app.reqUrl + 'mini.about_help',
      header: {
        "x-access-token": app.globalData.token
      },
      success: (res) => {
        console.log("help res >> ", res);
        if (res.data.errcode != 0) {
          win.nlog("加载失败~");
          return;
        }
        // wxParse.wxParse('help', 'html', '<p><img src="/uploads/2019-08-09/cc3be50afe5c2b23596237b70f2a017c.png" alt="爱心.png"><br></p>', this, 5);
        wxParse.wxParse('help', 'html', res.data.content || '', this, 5);
      }
    })
  }
})