Page({
  data: {
    adressList: [{
      name: "李先生",
      phone: "15216485497",
      adress: "梅州市梅江区华南大道18号",
      isDefault: true
    }, {
      name: "李先生",
      phone: "15216485497",
      adress: "梅州市梅江区华南大道18号",
      isDefault: false
    }, {
      name: "李先生",
      phone: "15216485497",
      adress: "梅州市梅江区华南大道18号",
      isDefault: false
    }, {
      name: "李先生",
      phone: "15216485497",
      adress: "梅州市梅江区华南大道18号",
      isDefault: false
    }, {
      name: "李先生",
      phone: "15216485497",
      adress: "梅州市梅江区华南大道18号",
      isDefault: false
    }]
  },
  goEdit() {
    wx.navigateTo({
      url: '/pages/editAdress/editAdress',
    })
  }
})