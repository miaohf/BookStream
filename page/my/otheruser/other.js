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
    wx.request({
      url:apiUrl+'otheruser',
      method:'POST',
      data:{
        openid:options.openid
      },
      header:{
        'content-type':'application/json'
      },
      success:function(res){
        console.log(res)
        wx.hideLoading()
        if(res.data.code==200){
          that.setData({
            'ta.avatar':res.data.ta.avatar,
            'ta.name':res.data.ta.name,
            'ta.ordernum':res.data.ta.ordernum,
            'ta.booknum':res.data.ta.booknum,
            'ta.openid':options.openid,
            'ta.gender':res.data.ta.gender
          })
        }else if(res.data.code==201){
          wx.showModal({
            title:'抱歉',
            content:'不存在该用户',
            success:function(){}
          })
        }
        
      },
      fail:function(err){
        console.log(err)
        wx.hideLoading()
        wx.showModal({
            title:'抱歉',
            content:'获取用户信息失败，请稍后退出本页面重试',
            success:function(){}
          })
      }
    });


    wx.request({
      url: apiUrl+'mybook', 
        method:'POST',
        data: {
          openid:options.openid
        },
        
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res)
          that.setData({
            books:res.data.books,
            num:res.data.num
          })
        },
        fail:function(err){
          console.log(err)
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

