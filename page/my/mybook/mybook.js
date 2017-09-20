var app = getApp()
const apiUrl = require('../../../config').apiUrl
Page({
  data: {
   user:{
   	avatar:''
   },
   books:'',
   num:'',
   is_operate_panel:true,
   animationData:'',
   chosenid:0,
   chosenstatus:'',
   chosenindex:''
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title:app.globalData.userInfo.nickName+'的书库'
    });
    var that=this
    wx.request({
    	url: apiUrl+'mybook', 
        method:'POST',
        data: {
          openid:app.globalData.openid
        },
        
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res)
          that.setData({
            books:res.data.books,
            'user.avatar':app.globalData.userInfo.avatarUrl,
            num:res.data.num
          })
        },
        fail:function(err){
          console.log(err)
        }
    })
  },
  iflocationjump:function(e){
    app.getCity(function(sign,city){

      if(sign==0){
        wx.showModal({
          title: '获取城市失败',
          content: '请授权后添加书籍',
          success: function(res) {

          }
        })
      }else{
        wx.navigateTo({
          url: '../addbook/add'
        })
      }
    })
  },
  hideoperatebox:function(){
    var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
        })
    this.setData({
      is_operate_panel:true
    })
    this.animation = animation
    animation.translateY(131).step()
    this.setData({
      animationData:animation.export()
    })
  },
  menutap:function(e){
    console.log(e.currentTarget.dataset.id)
    this.setData({
      is_operate_panel:false,
      chosenid:e.currentTarget.dataset.id,
      chosenstatus:e.currentTarget.dataset.status,
      chosenindex:e.currentTarget.dataset.index
    })
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    
    this.animation = animation
    animation.translateY(-131).step()
    this.setData({
      animationData:animation.export()
    })
  }
})

