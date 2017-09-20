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
    wx.request({
      url: apiUrl+'themail', 
      method:'GET',
      data: {
        id:options.id,
        openid:app.globalData.openid
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res);
        that.setData({
          themail:res.data.themail
        });
        var pages=getCurrentPages();
        var prepage=pages[pages.length-2]
        var recieves=prepage.data.recieves
        recieves[options.index].status=0;
        prepage.setData({
          recieves:recieves
        })
      },
      fail:function(err){
        console.log(err)
        wx.showModal({
          title:'失败',
          content:'加载失败，请稍后再试',
          success:function(){
          }
        })
      }
    });
  },
  response:function(){
  	this.setData({response:1})
  },
  sendmail:function(e){
  	var mail=e.detail.value.mail;
  	console.log(mail)
  	if(mail.length>0){
  		var that=this
	    wx.request({
	      url: apiUrl+'sendmail', 
	      method:'POST',
	      data: {
	        openid:app.globalData.openid,
	        toopenid:this.data.themail.fromopenid,
	        message:mail
	      },
	      header: {
	          'content-type': 'application/json'
	      },
	      success: function(res) {
	        console.log(res);
	        if(res.data.code==200){
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
	        }else if(res.data.code==404){
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
	        
	      },
	      fail:function(err){
	        console.log(err)
          wx.showModal({
            title:'失败',
            content:'邮件发送失败，请稍后再试',
            success:function(){
            }
          })
	      }
	    });
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

