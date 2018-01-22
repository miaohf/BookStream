var app = getApp()
const apiUrl = require('../../../config').apiUrl
Page({
  data: {
    title:'我借过的书',
    list: [

    ],
    nowlist_guide:0,
    alldone:0
  },
  onLoad: function(options) {
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
        guide:this.data.nowlist_guide
      }
      app.req('iborrow',postdata,'POST',function(backsign,backdata){
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
            wx.hideLoading()
          }else{
            console.log('done')
            wx.showToast({
              title: '到底啦',
              icon: 'success',
              duration: 1200
            })
            that.setData({
              alldone:1
            })
            wx.stopPullDownRefresh()
            wx.hideLoading()
          }
      })
    }
    
  }
})

