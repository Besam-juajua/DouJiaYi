module.exports = function partPage(url, format, method = "POST", header = {}) {
  return (theirList, theirPage, isReload = false, data = {}) => {
    let page = isReload ? 0 : theirPage;
    let list = isReload ? [] : theirList;
    data.page = page + 1;
    return new Promise((resolve, reject) => {
      
    })

  }
}