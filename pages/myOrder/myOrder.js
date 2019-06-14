Page({
  data: {
    currentNav: 0, // 当前选中的导航 nav
    orderList: [{ // 这是个二位数组，保存订单列表，以及订单内的product列表
      orderNum: "1245644688798789652331",
      date: "2018-12-23  12:30",
      products: [{
        thumb: "/images/test.png",
        title: "豆加壹45g黄糖笑包",
        specs: "45g*12个",
        count: 2,
        price: 4.20,
      }, {
        thumb: "/images/test.png",
        title: "豆加壹45g黄糖笑包",
        specs: "45g*12个",
        count: 2,
        price: 4.20,
      }]
    }, {
      orderNum: "1245644688798789652331",
      date: "2018-12-23  12:30",
      products: [{
        thumb: "/images/test.png",
        title: "豆加壹45g黄糖笑包",
        specs: "45g*12个",
        count: 2,
        price: 4.20,
      }, {
        thumb: "/images/test.png",
        title: "豆加壹45g黄糖笑包",
        specs: "45g*12个",
        count: 2,
        price: 4.20,
      }]
    }]
  },
  onLoad(options) {
    let type = options.type;
    if(type != "undefined") {
      this.setData({
        currentNav: type
      })
    }
  },
  switchNav(e) {
    this.setData({
      currentNav: e.currentTarget.dataset.nav || e.arget.dataset.nav
    })
  },
  goProduct() {
    wx.navigateTo({
      url: '/pages/detail/detail'
    })
  },
  goRemark() {
    if(this.data.currentNav != 2) return;
    wx.navigateTo({
      url: '/pages/remark/remark',
    })
  }
})