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
   chosenindex:'',
   borrownum:0
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title:app.globalData.userInfo.nickName+'的书库'
    });
    this.loadbook();
  },
  loadbook:function(){
    wx.showLoading({
          title: '正在加载',
    });
    var that=this
    app.req('mybook','','POST',function(backsign,backdata){
      if(backsign==1){
        wx.hideLoading()
          that.setData({
            books:backdata.data.data.books,
            'user.avatar':app.globalData.userInfo.avatarUrl,
            num:backdata.data.data.num,
            borrownum:backdata.data.data.borrowcount
          })
        }else{
          wx.hideLoading()
        }
    })
  },
  iflocationjump:function(e){
    app.getCity(function(sign,city,cityname){
      console.log(sign+','+cityname+','+city)
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
    },0)
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
    animation.translateY(231).step()
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
    animation.translateY(-231).step()
    this.setData({
      animationData:animation.export()
    })
  },
  delbook:function(){
    wx.showLoading({
          title: '正在加载',
    });
    var that=this
    var postdata={
      id:this.data.chosenid
    }
    app.req('delbook',postdata,'POST',function(backsign,backdata){
      if(backsign==1){
        that.hideoperatebox()
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
            that.loadbook()
            var pages=getCurrentPages();
            var prepage=pages[pages.length-2]
            var my=prepage.data.my
            var mybook=my
            mybook.booknum=backdata.data.data.booknum
            prepage.setData({
              my:mybook
            })
          }else{
            wx.hideLoading()
            that.hideoperatebox()
            wx.showToast({
              title: '失败',
              icon: 'loading',
              duration: 1000
            })
          }
    })
  }
})

