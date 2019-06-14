const app = getApp();

Page({
  data: {
    advertises: [],
    goods: [],
    imgUrl: app.imgUrl,
  },
  onLoad() {
    wx.request({
      url: app.reqUrl + 'mini.index',
      method: "GET",
      success: (res) => {
        console.log("index>>>>",res)
        this.setData({
          advertises: res.data.advertises,
          goods: res.data.goods
        })
      },
      fail: (res) => {
        console.log("error>>>", res)
      }
    })
  },
  goProduct() {
    wx.switchTab({
      url: '/pages/product/product'
    })
  },
  goPurchase() {
    wx.switchTab({
      url: '/pages/purchase/purchase'
    })
  },
  goNotice() {
    wx.navigateTo({
      url: '/pages/notice/notice'
    })
  },

})