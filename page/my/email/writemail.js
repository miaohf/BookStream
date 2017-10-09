var app = getApp()
const apiUrl = require('../../../config').apiUrl
var toopenid,avatar=''
Page({
  data: {
    title:'写邮件',
    response:0,
    avatar:''
   },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title:this.data.title
    })
    toopenid=options.openid
    avatar=options.avatar
    this.setData({
      avatar:avatar
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
	    wx.request({
	      url: apiUrl+'sendmail', 
	      method:'POST',
	      data: {
	        openid:app.globalData.openid,
	        toopenid:toopenid,
	        message:mail
	      },
	      header: {
	          'content-type': 'application/json'
	      },
	      success: function(res) {
	        console.log(res);
          wx.hideLoading()
	        if(res.data.code==200){
	        	wx.showModal({
		        	title:'成功',
		        	content:'邮件发送成功',
		        	success:function(){
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
          wx.hideLoading()
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

