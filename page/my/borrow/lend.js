var app = getApp()
const apiUrl = require('../../../config').apiUrl
var bookid=0
Page({
  data: {
    title:'谁借过这本书',
    list: [

    ],
    nowlist_guide:0,
    alldone:0
  },
  onLoad: function(options) {
    bookid=options.id
    this.asklist(0);
    wx.setNavigationBarTitle({
      title:this.data.title
    })
    
  },
  onReachBottom:function(e){
    this.asklist(0);
  },
  asklist:function(sign){
    console.log(this.data)
    if(this.data.alldone==0){
      wx.showLoading({
        title: '正在加载',
      })
      var that=this
      var postdata={
        openid:app.globalData.openid,
        guide:this.data.nowlist_guide,
        bookid:bookid
      }
      app.req('ilend',postdata,'POST',function(backsign,backdata){
        wx.hideLoading()
        if(backsign==1){
          if(sign==1){
              var list=[];
            }else{
              var list=that.data.list
            }
            var addlist=backdata.data.data.data
            var newlist={}
            newlist=list.concat(addlist)
            list=addlist=null
            console.log(newlist)
            that.setData({
              list:newlist,
              nowlist_guide:backdata.data.data.guide.created_at
            })
            wx.stopPullDownRefresh()
        }else{
          wx.showToast({
              title: '到底啦',
              icon: 'success',
              duration: 1200
            })
            that.setData({
              alldone:1
            })
            wx.stopPullDownRefresh()
        }
      })

    }
    
  }
})

