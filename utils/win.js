var nlog = (title) => {
  wx.showToast({
    title: title,
    icon: "none"
  })
}

var toast = (title) => {
  wx.showToast({
    title: title
  })
}

var loading = (title) => {
  wx.showLoading({
    title: title
  })
}

var hideLoading = () => {
  wx.hideLoading();
}

module.exports = {
  nlog,
  toast,
  loading,
  hideLoading,
}