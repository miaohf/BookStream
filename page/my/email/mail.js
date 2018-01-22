var app = getApp()
const apiUrl = require('../../../config').apiUrl
Page({
  data: {
    title:'邮件',
    response:0,
    themail:{

    }
   },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title:this.data.title
    })
    var that=this
    wx.showLoading({
          title: '正在加载',
      });
    var getdata={
      id:options.id
    }
    app.req('themail',getdata,'GET',function(backsign,backdata){
      if(backsign==1){
         wx.hideLoading()
        that.setData({
          themail:backdata.data.data.themail
        });
        var pages=getCurrentPages();
        var prepage=pages[pages.length-2]
        var recieves=prepage.data.recieves
        recieves[options.index].status=0;
        prepage.setData({
          recieves:recieves
        })
      }else{
        wx.hideLoading()
        wx.showModal({
          title:'失败',
          content:'加载失败，请稍后再试',
          success:function(){
          }
        })
      }
    })
  },
  response:function(){
  	this.setData({response:1})
  },
  sendmail:function(e){
  	var mail=e.detail.value.mail;
  	console.log(mail)
  	if(mail.length>0){
  		var that=this
      wx.showLoading({
          title: '正在加载',
      });
      var postdata={
        toopenid:this.data.themail.fromopenid,
        message:mail
      }
      app.req('sendmail',postdata,'POST',function(backsign,backdata){
        if(backsign==1){
            wx.showModal({
              title:'成功',
              content:'邮件发送成功',
              success:function(){
                var pages=getCurrentPages();
                var prepage=pages[pages.length-2]
                prepage.bar(2)

                wx.navigateBack({
                  delta:1
                })
              }
            })
        }else if(backsign==4){
            wx.showModal({
              title:'失败',
              content:'邮件发送失败，找不到收件人',
              success:function(){
              }
            })
        }else{
          wx.showModal({
              title:'失败',
              content:'邮件发送失败，请稍后再试',
              success:function(){
              }
            })
        }
        wx.hideLoading()
      })
  	}else{
  		wx.showModal({
          title: '抱歉',
          content: '请填写内容后再试',
          success: function(res) {
          }
        })
  	}
  }
})

