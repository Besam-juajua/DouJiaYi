const app = getApp();

Page({
  data: {
    imgUrl: app.imgUrl,
    advertises: [],
    goods: [],
    about: "",
  },
  onLoad() {
    wx.request({
      url: app.reqUrl + 'mini.index',
      method: "GET",
      success: (res) => {
        console.log("index>>>>",res)
        this.setData({
          advertises: res.data.advertises,
          goods: res.data.goods,
          about: res.data.about_us.thumb
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
  goOrder() {
    wx.switchTab({
      url: '/pages/order/order'
    })
  },
  goNotice() {
    wx.navigateTo({
      url: '/pages/notice/notice'
    })
  },
  goDetail(e) {
    if (app.notLogin()) return;
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  goAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },
  lookPictrue(e) {
    let imgs = this.data.advertises.map((val) => {
      return this.data.imgUrl + val.path
    })
    console.log(imgs)
    wx.previewImage({
      urls: imgs,
      current: e.currentTarget.dataset.index
    })
  }
})