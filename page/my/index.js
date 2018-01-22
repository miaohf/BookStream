const apiUrl = require('../../config').apiUrl
var app = getApp()
Page({
  data: {
  title:'我的主页',
   my:{
    avatar:'../../image/icon.png',
    name:'访客',
    ordernum:0,
    booknum:0,
    isme:0,
    sign:''
   },
    mailcount:0,
    commentcount:0,
    borrowcount:0,
    },
  onLoad: function(options) {
    console.log(app.globalData)
    wx.setNavigationBarTitle({
      title:this.data.title
    })
    this.loadpage()
  },
  onShow:function(){
    var that=this
    app.getUserInfo(function(sign){
      if(sign==1){
        app.req('checkmine','','GET',function(backsign,backdata){
          if(backsign==1){
            that.setData({
              mailcount:backdata.data.data.mails,
              commentcount:backdata.data.data.comment,
              borrowcount:backdata.data.data.borrow,
              'my.avatar':backdata.data.data.avatar
            })
            app.globalData.userInfo.avatarUrl=backdata.data.data.avatar
          }
        })
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
  },
  getuser:function(e){
    //console.log(e)
    if(e.detail.userInfo){
      console.log(e.detail.userInfo)
      app.globalData.userInfo=e.detail.userInfo
      app.globalData.hasLogin=true
      app.globalData.hasuserinfo=true
      wx.setStorageSync('userInfo', e.detail.userInfo)
      wx.setStorageSync('hasuserinfo', true)
      wx.setStorageSync('hasLogin', true)
      this.setData({
        isme:1
      })
      this.loadpage()
    }else{
      //fail refuse 
      console.log('fail')
    }
  },
  loadpage:function(){
    var that=this
    app.getUserInfo(function(sign){
      if(sign==1){
        that.setData({
          'my.avatar':app.globalData.userInfo.avatarUrl,
          'my.name':app.globalData.userInfo.nickName,
          'my.isme':1
        })
        wx.showLoading({
          title: '正在加载',
        });
        app.req('me','','POST',function(backsign,backdata){
          if(sign==1){
            that.setData({
                'my.ordernum':backdata.data.data.me.ordernum,
                'my.booknum':backdata.data.data.me.booknum,
                'my.sign':backdata.data.data.me.sign
              })
          }else{
            that.setData({
                'my.isme':0
              })
          }
        })
        wx.hideLoading()
      }else{
        that.setData({
          'my.isme':0
        })
      }
    })
  }
})

