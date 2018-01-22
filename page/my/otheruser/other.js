var app = getApp()
const apiUrl = require('../../../config').apiUrl
Page({
  data: {
  title:'我的主页',
   ta:{
    
   },
   books:''
    },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title:this.data.title
    })
    var that=this
    wx.showLoading({
          title: '正在加载',
      });
    var postdata={
      openid:options.openid
    }
    app.req('otheruser',postdata,'POST',function(backsign,backdata){
      
      if(backsign==1){
        that.setData({
            'ta.avatar':backdata.data.data.ta.avatar,
            'ta.name':backdata.data.data.ta.name,
            'ta.ordernum':backdata.data.data.ta.ordernum,
            'ta.booknum':backdata.data.data.ta.booknum,
            'ta.openid':options.openid,
            'ta.gender':backdata.data.data.ta.gender,
            'ta.sign':backdata.data.data.ta.sign
          })
      }else if(backsign==4){
        wx.showModal({
            title:'抱歉',
            content:'不存在该用户',
            success:function(){}
          })
      }else{
        wx.showModal({
            title:'抱歉',
            content:'获取用户信息失败，请稍后退出本页面重试',
            success:function(){}
          })
      }
      wx.hideLoading()
    })
 

    app.req('mybook',postdata,'POST',function(backsign,backdata){
      if(backsign==1){
        that.setData({
            books:backdata.data.data.books,
            num:backdata.data.data.num
          })
      }else{

      }
    })

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '个人主页',
      success: function(res) {},
      fail: function(res) {}
    }
  }
})

