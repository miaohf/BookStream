const apiUrl = require('../../config').apiUrl
const app=getApp()

Page({
  data: {
    getBook:0,
    theBook:[]
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
        that.setData({
          getBook:1,
          theBook:backdata.data.data
        })
        var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
        })
        
        that.animation = animation
        animation.translateY(230).step()
        that.setData({
          animationData:animation.export()
        })
        console.log(that.data)
      }

    })

  }
})

