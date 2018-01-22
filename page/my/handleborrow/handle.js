var app = getApp()
var apiUrl=require('../../../config').apiUrl
var thisid=''
var thisindex=''
Page({
  data: {
   info:{

   }
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title:'handle'
    })
    var id=options.id;
    var that=this;
    thisid=id;
    thisindex=options.index;
    wx.showLoading({
          title: '正在加载',
      });
    var postdata={
      id:id
    }
    app.req('handleborrow',postdata,'POST',function(backsign,backdata){
      if(backsign==1){
        wx.hideLoading()
        that.setData({
          'info.bookimg':backdata.data.data.thebook.image_m,
          'info.bookname':backdata.data.data.thebook.name,
          'info.borrowname':backdata.data.data.from.name,
          'info.gender':backdata.data.data.from.gender,
          'info.booksnum':backdata.data.data.from.booksnum,
          'info.time':backdata.data.data.record.updated_at,
          'info.comment':backdata.data.data.record.comment,
          'info.useravatar':backdata.data.data.from.avatar,
          'info.status':backdata.data.data.record.status
        })
      }else{
        wx.hideLoading()
      }
    })
  },
  handleit:function(e){
  	var choose=e.detail.target.dataset.choose;
  	app.getUserInfo(function(sign){
  		if(sign){
        wx.showLoading({
          title: '正在加载',
      });
        var postdata={
          choose:choose,
            id:thisid,
            formid:e.detail.formId
        }
        app.req('handleborrowre',postdata,'POST',function(backsign,backdata){
          wx.hideLoading()
          if(backsign==1){
              if(choose==1){
                  wx.showModal({
                    title: '处理成功',
                    content: '敬告：该书目前状态为待借，与书友交接成功后请您手动进入“我的书”内设置状态。',
                    success: function(res) {
                      //跳到我的书页，同时发一封邮件给人
                      wx.redirectTo({
                        url: '../mybook/mybook'
                      })
                    }
                  })
                }else if((choose==2)||(choose==3)){
                  wx.showModal({
                    title: '处理成功',
                    content: '您已忽略或拒绝此次借书申请',
                    success: function(res) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  })
                }
                var pages=getCurrentPages();
                var prepage=pages[pages.length-2]
                var recieves=prepage.data.recieves
                if(choose==1){
                  recieves[thisindex].statusname="借出";
                }else if(choose ==2){
                  recieves[thisindex].statusname="拒绝借出";
                }else if(choose ==3){
                  recieves[thisindex].statusname="已忽略";
                }
                prepage.setData({
                  recieves:recieves
                })
          }else if(backsign==4){
            wx.showModal({
                title: '处理失败',
                content: '该申请已过期或失效',
                success: function(res) {
                }
              })
          }else{
              wx.showModal({
                title: '处理失败',
                content: '请稍后再试',
                success: function(res) {
                }
              })
            }
        })
 
  		}else{
  			//
  		}
  	})
  	
  }
})

