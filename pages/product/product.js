/**   
 * 分页请求列表 （移植时，具体更改 url, method, header, data）
 * 请求参数： theirPage：页面当前页数，从 0 开始
 *           theirList: 存放列表的变量
 *           isReload: 是否重新刷新
 * 返回参数： page: 页面新页数
 *           list: 页面新列表
 */
// function getList(theirList, theirPage, isReload = false) {
//   let page = isReload ? 0 : theirPage;
//   let list = isReload ? [] : theirList;
//   wx.request({
//     url: url,
//     method: "POST",
//     data: {
//       page: page + 1,
//     },
//     success: (res) => {
//       console.log("><> ><> 分页: ",res);
//       if(res.data && res.data.length == 0) return;
//     },
//     fail: (res) => {
//       page = theirPage;
//       list = theirList;
//     }
//   })
//   return {
//     page,
//     list
//   };
// }



const app = getApp();
const win = require("../../utils/win.js")

// 分页数据
function getList(self, isReload = false) {
  let page = isReload ? 0 : self.data.page;
  let list = isReload ? [] : self.data.productList;
  if(isReload) win.loading("正在加载");
  wx.request({
    url: app.reqUrl + "mini.goods_list",
    method: "GET",
    data: {
      page: page + 1
    },
    success(res) {
      console.log("product", res);
      if (res.data.errcode != 0) return;
      if (res.data.goods && res.data.goods.length == 0) return;
      list = res.data.goods;
      list = list.map(val => {
        val.count = 0;
        return val;
      })
      page += 1;
      self.setData({
        page: page,
        productList: list,
      })
    },
    fail(res) {
      win.nlog("当前网络不可用！")
    },
    complete() {
      wx.stopPullDownRefresh();
      if(isReload) win.hideLoading();
    }
  })
}

Page({
  data: {
    imgUrl: app.imgUrl,
    page: 0,
    productList: []
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
  goDetail(e) {
    if (app.notLogin()) return;
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id,
    })
  }
})