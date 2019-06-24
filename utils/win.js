var nlog = (title) => {
  wx.showToast({
    title: title,
    icon: "none"
  })
}

var toast = (title, time = 1000) => {
  wx.showToast({
    title: title,
    duration: time,
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