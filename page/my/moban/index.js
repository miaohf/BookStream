var app = getApp()
Page({
  data: {
   
    },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title:this.data.book.title
    })
  }
})

