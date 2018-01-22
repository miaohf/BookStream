const apiUrl = require('../../config').apiUrl
const app=getApp()

Page({
  data: {
    
  },
  onLoad: function() {
    
  },
  togetdrift:function(){
    var that=this
    wx.showLoading({
          title: '正在加载',
      });
    app.req('getdrift','','POST',function(backsign,backdata){
      wx.hideLoading()
      if(backsign==1){
        
      }
    })

  }
})

