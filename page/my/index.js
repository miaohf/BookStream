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
    mailcount:0,
    commentcount:0,
    borrowcount:0,
    sign:''
   }
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
    app.toGetUser(function(sign){
      if(sign==1){
        wx.request({
          url: apiUrl+'checkmine', 
          method:'GET',
          data: {
            openid:app.globalData.openid
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res);
            that.setData({
              mailcount:res.data.mails,
              commentcount:res.data.comment,
              borrowcount:res.data.borrow
            })
          },
          fail:function(err){
            console.log(err)
          }
        });
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
    app.toGetUser(function(sign){
      if(sign==1){
        that.setData({
          'my.avatar':app.globalData.userInfo.avatarUrl,
          'my.name':app.globalData.userInfo.nickName,
          'my.isme':1
        })
        wx.showLoading({
          title: '正在加载',
        });
        wx.request({
          url: apiUrl+'me', 
          method:'POST',
          data: {
              openid:app.globalData.openid
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res)
            wx.hideLoading()
            if(res.data.code==200){
              that.setData({
                'my.ordernum':res.data.me.ordernum,
                'my.booknum':res.data.me.booknum,
                'my.sign':res.data.me.sign
              })
            }else{
              that.setData({
                'my.isme':0
              })
            }
          },
          fail:function(err){
            wx.hideLoading()
            that.setData({
                'my.isme':0
            })
          }
        })
      }else{
        that.setData({
          'my.isme':0
        })
      }
    })
  }
})

