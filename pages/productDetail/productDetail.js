let wxParse = require("../../wxParse/wxParse.js");
let win = require("../../utils/win.js");
const app = getApp();

Page({
  data: {
    imgUrl: app.imgUrl,
    origin: "", // 记录跳转过来的页面
    labelIndex: -1, // 记录对应采购表label的索引
    stockIndex: -1, // 记录对应采购表label的stock的索引
    id: "",
    info: {},
    showBox: false,
    price: 0,
    count: 0,
    specsName: ""
  },
  onLoad(options) {
    console.log("options>>>", options)
    if(!options.id) return;
    this.setData({
      id: options.id, // 非采购表进来，只有这个字段，下面的字段，都是采购表进来才有的
      origin: options.origin || "",
      labelIndex: options.labelIndex || -1,
      stockIndex: options.stockIndex || -1,
      specsName: options.spec || "",
      price: options.price || 0
    })
    if(this.data.origin == "order") {
      this.getOrderDetail();
      return;
    }
    this.getCommonDetail();
  },
  // 下单表进来的，获取的详情接口
  getOrderDetail() {
    console.log(">>>>>", this.data.id)
    wx.request({
      url: app.reqUrl + "mini.cart_info",
      method: "GET",
      header: {
        "x-access-token": app.globalData.token
      },
      data: {
        id: this.data.id,
        uid: ""
      },
      success: (res) => {
        if (res.data.errcode != 0) return;
        let goods = res.data.goods_info
        this.setData({
          specsName: goods.specs[0].name,
          price: goods.specs[0].price,
          count: goods.count,
          info: goods,
        })
        console.log(">>>", this.data.info);
        wxParse.wxParse('productDetail', 'html', this.data.info.content, this, 5);
      }
    })
  },
  // 普通页面进来的，或取的详情接口
  getCommonDetail() {
    wx.request({
      url: app.reqUrl + "mini.goods_info",
      method: "GET",
      header: {
        "x-access-token": app.globalData.token
      },
      data: {
        id: this.data.id,
        uid: ""
      },
      success: (res) => {
        console.log("res: >>>>", res)
        if (res.data.errcode != 0) return;
        let goods = res.data.goods_info
        // 假如是从采购表进来该页面的，就将规格变为采购表的规格
        if (this.data.origin == "purchase") {
          goods.specs = [{
            name: this.data.specsName
          }]
        }
        this.setData({
          info: goods,
        })
        console.log(">>>", this.data.info);
        wxParse.wxParse('productDetail', 'html', this.data.info.content, this, 5);
      }
    })
  },
  subCount() {
    if (this.data.count <= 0) return;
    this.setData({
      count: this.data.count - 1
    })
  },
  addCount() {
    if (this.data.count >= 99) return;
    if(!this.data.specsName) { // 加入没选规格，默认选择第一个
      let specs = this.data.info.specs[0];
      this.setData({
        price: specs.price,
        specsName: specs.name,
        startNum: specs.start_num,
        endNum: specs.end_num
      })
    }
    this.setData({
      count: this.data.count + 1,
      specsName: this.data.info.specs[0].name
    })
  },
  showSpecs() {
    this.setData({
      showBox: true
    })
  },
  hideSpecs() {
    this.setData({
      showBox: false
    })
  },
  getSpecs(e) {
    let data = e.target.dataset;
    this.setData({
      price: data.price,
      specsName: data.name,
      startNum: data.startnum,
      endNum: data.endnum
    })
  },
  // 立即添加
  addGoods() {
    // 采购表进来的走这里
    if(this.data.origin == "purchase") {
      this.postPurchase();
      return;
    }
    // 下单表进来的走这里
    if(this.data.origin == "order") {
      this.postOrder();
      return;
    }
    // 产品册进来的走这里
    this.postGoods();
  },
  // 将添加的商品数量带至purchase页
  postPurchase() {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    prePage.addProduct(this.data.labelIndex, this.data.stockIndex, this.data.count);
    wx.navigateBack();
  },
  // 将添加的商品数量带至order页
  postOrder() {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    prePage.addProduct(this.data.stockIndex, this.data.count);
    wx.navigateBack();
  },
  // 添加商品至采购列表
  postGoods() {
    win.loading("添加中...");
    wx.request({
      url: app.reqUrl + "mini.goods_add",
      method: "POST",
      header: {
        'x-access-token': app.globalData.token
      },
      data: {
        gid: this.data.info._id,
        gspec: JSON.stringify({
          name: this.data.specsName,
          price: this.data.price,
          start_num: this.data.startNum,
          end_num: this.data.endNum
        })
      },
      success: (res) => {
        console.log("添加结果", res)
        if(res.data.errcode != 0) {
          win.nlog(res.data.description);
          return;
        }
        win.nlog("添加成功!");
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/purchase/purchase',
          })
        }, 500)
      }
    })
  },
  // 分享
  onShareAppMessage(res) {
    return {
      title: "豆加壹食品",
      path: "/pages/index/index",
      imageUrl: "/images/home_banner.png"
    }
  }
})