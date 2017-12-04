var app = getApp()
Page({
  data: {
    avatar:'https://www.aliencat.cn/images/myavatar.jpg',
    streamimg:'../../../image/icon.png'
    },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title:'联系开发者'
    })
  }
})

