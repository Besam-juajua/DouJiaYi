const app = getApp();

Page({
  data: {
    imgUrl: app.imgUrl,
    userinfo: app.globalData.userinfo
  },
  onShow() {
    console.log(app.globalData.userinfo)
  },
  goMyOrder(e) {
    wx.navigateTo({
      url: '/pages/myOrder/myOrder?type=' + e.currentTarget.dataset.type
    })
  },
  goMessage() {
    wx.navigateTo({
      url: '/pages/message/message'
    })
  },
  goFavorite() {
    wx.navigateTo({
      url: '/pages/favorite/favorite'
    })
  },
  goAdress() {
    wx.navigateTo({
      url: '/pages/adress/adress'
    })
  },
  goGoodsRest() {
    wx.navigateTo({
      url: '/pages/goodsRest/goodsRest'
    })
  },
  goHelp() {
    wx.navigateTo({
      url: '/pages/help/help'
    })
  },
  goAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },
  goFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    })
  }

})