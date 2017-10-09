const apiUrl = require('../../config').apiUrl
const app=getApp()

Page({
  data: {
    swiper:{
      indicatorDots: false,
      vertical: false,
      interval: 3500,
      duration: 500,
      autoplay:true,
      binnerimg:[]
    },
    list: [
      
    ]
  },
  onLoad: function(options) {
    
    var nowtime=new Date().getTime()
    if(wx.getStorageSync('timer_1')){
      if(nowtime-wx.getStorageSync('timer_1')>86400000){
        //过期
        this.togetkind();
      }else{
        //没过期
        this.setData({
          list:wx.getStorageSync('page_1_list'),
          'swiper.binnerimg':wx.getStorageSync('page_1_binner')
        })
      }
    }else{
      //没设置过
      this.togetkind();
    }
  },
  togetkind:function(){
    var that=this
    wx.showLoading({
          title: '正在加载',
      });
    wx.request({
      url: apiUrl+'kinds', 
      method:'GET',
      data: {

      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideLoading()
        console.log(res)
        var list=that.data.list
        var addlist=res.data.data.kinds
        var newlist={}
        newlist=list.concat(addlist)
        list=addlist=null
        that.setData({
          list:newlist
        })
        that.setData({
          'swiper.binnerimg':res.data.data.banner
        })
        wx.setStorageSync('page_1_list', newlist)
        wx.setStorageSync('page_1_binner', res.data.data.banner)
        var nowtime=new Date().getTime()
        wx.setStorageSync('timer_1', nowtime)
      },
      fail:function(err){
        wx.hideLoading()
        console.log(err)
      }
    })
  },
  
  kindToggle: function (e) {
    this.setData({
      list: list
    });
  },
  bgto:function(e){
    console.log(e)
    var navi=e.currentTarget.dataset.navi;
    if(navi!=''){
      wx.navigateTo({
        url:navi
      })
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '首页',
      success: function(res) {},
      fail: function(res) {}
    }
  }
})

