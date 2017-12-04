var app = getApp()
const apiUrl = require('../../../config').apiUrl
Page({
  data: {
    title:'',
    list: [

    ],
    nowlist_guide:0,
    alldone:0
  },
  onLoad: function(options) {
    this.setData({
      options:options
    })

    this.asklist(0);

    this.setData({
      title:options.kind
    });
    wx.setNavigationBarTitle({
      title:options.kind
    })
  },
  onReachBottom:function(e){
    this.asklist(1);
  },
  onPullDownRefresh:function(e){
    this.setData({
      nowlist_guide:0,
      alldone:0
    });
    this.asklist(0)
  },
  asklist:function(sign){
    if(this.data.alldone==0){
      wx.showLoading({
        title: '正在加载',
      })
      var that=this
      var postdata={
        kind:this.data.options.kind_en,
        guide:this.data.nowlist_guide,
        onlycity:app.globalData.onlycity
      }
      app.req('kindbooks',postdata,'POST',function(backsign,backdata){
        if(backsign==1){
          wx.hideLoading()
          if(backdata.data.data.data!=''){
            if(sign==0){
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
          }
        }else{
          wx.hideLoading()
          console.log(backdata)
          wx.stopPullDownRefresh()
        }
      })
    }
    console.log(this.data.list)
  }
})

