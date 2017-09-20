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
    this.asklist(0);
  },
  onPullDownRefresh:function(e){
    this.setData({
      nowlist_guide:0,
      alldone:0
    });
    this.asklist(1)
  },
  asklist:function(sign){
    if(this.data.alldone==0){
      wx.showLoading({
        title: '正在加载',
      })
      var that=this
      wx.request({
        url: apiUrl+'kindbooks', 
        method:'POST',
        data: {
          kind:this.data.options.kind_en,
          guide:this.data.nowlist_guide
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res)
          if(res.data.code==200){
            if(sign==1){
              var list=[];
            }else{
              var list=that.data.list
            }
            var addlist=res.data.data
            var newlist={}
            newlist=list.concat(addlist)
            list=addlist=null
            console.log(newlist)
            that.setData({
              list:newlist,
              nowlist_guide:res.data.guide.created_at
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
        },
        fail:function(err){
          wx.hideLoading()
          console.log(err)
          wx.stopPullDownRefresh()
        }
      })
    }
    
  }
})

