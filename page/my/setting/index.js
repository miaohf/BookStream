var app = getApp()
const apiUrl = require('../../../config').apiUrl;
Page({
  data: {
   		name:app.globalData.userInfo.nickName,
   		avatar:app.globalData.userInfo.avatarUrl,
   		title:'设置',
   		onlycity:app.globalData.onlycity,
   		relocatename:0,
   		setavatar:0,
   		sign:''
    },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title:this.data.title
    })
    this.setData({
    	onlycity:app.globalData.onlycity,
    	name:app.globalData.userInfo.nickName,
   		avatar:app.globalData.userInfo.avatarUrl,
    	sign:options.sign
    })
  },
  switch1Change: function (e){
    if(e.detail.value==false){
    	app.globalData.onlycity=0;
    	wx.setStorageSync('onlycity', 0)
    }else{
    	//检查是否有城市 若无 获取城市
    	app.getCity(function(sign,code,cityname){
    		if(sign==1){
    			app.globalData.onlycity=code
    			wx.setStorageSync('onlycity', code)
    		}
    	});
    }
  },
  setting:function(e){
  	var self=this
  	if(self.data.setavatar!=0){
  		wx.showLoading({
	      title: '正在上传图片',
	    });
  		wx.uploadFile({
	      url: apiUrl+'settingavatar', //仅为示例，非真实的接口地址
	      filePath: self.data.setavatar,
	      name: 'file',
	      formData:{
	        'user': 'test'
	      },
	      success: function(res){
	      	console.log(res)
	      	wx.hideLoading()
	        if((JSON.parse(res.data).code)&&(JSON.parse(res.data).code==200)){
	        	self.setnameandsign(e.detail.value.nickname,e.detail.value.sign,JSON.parse(res.data).filename)
	        }else if((JSON.parse(res.data).code)&&(JSON.parse(res.data).code==500)){
	        	wx.showToast({
		    		title: "失败！图片太大了",
		    		icon: "loading",//仅支持success或者loading
		    		duration: 1000
		    	});
	        }else{
	        	wx.showToast({
		    		title: "修改失败",
		    		icon: "loading",//仅支持success或者loading
		    		duration: 1000
		    	});
	        }
	      }
	    })
  	}else{
  		//直接修改名字
  		self.setnameandsign(e.detail.value.nickname,e.detail.value.sign,0)
  	}
  	
  },
  setnameandsign:function(name,sign,avatar){
  	var self=this
  	//修改请求
  	wx.showLoading({
      title: '正在提交',
    });
	wx.request({
	  //必需
	  url: apiUrl+'setting', 
	  method:'POST',
	  data: {
	      openid:app.globalData.openid,
	      name:name,
	      sign:sign,
	      avatar:avatar
	  },
	  header: {
	      'Content-Type': 'application/json'
	  },
	  success: function(res) {
	    console.log(res)
	    wx.hideLoading()
	    if(res.data.code==200){
	    	//修改globaldata,改变主页头像
	    	app.globalData.userInfo.nickName=name
	    	if(self.data.setavatar!=0){
		    	app.globalData.userInfo.avatarUrl=self.data.setavatar
		    }
	    	wx.setStorageSync('userInfo', app.globalData.userInfo)
	    	var pages=getCurrentPages();
	        var prepage=pages[pages.length-2]
	        var my=prepage.data.my
	        my.name=name
	        my.sign=sign
	        if(self.data.setavatar!=0){
	        	my.avatar=self.data.setavatar
	        }
	        prepage.setData({
	          my:my
	        })
	    	wx.showToast({
	    		title: "修改成功",
	    		icon: "success",//仅支持success或者loading
	    		duration: 1000,
	    		success:function(){
	    			wx.navigateBack({
	                  delta:1
	                })
	    		}
	    	});
	    }else{
	    	wx.showToast({
	    		title: "修改失败",
	    		icon: "loading",//仅支持success或者loading
	    		duration: 1000
	    	});
	    }
	    
	  },
	  fail: function(res) {
	    console.log(res)
	    wx.hideLoading()
	    wx.showToast({
    		title: "修改失败",
    		icon: "loading",//仅支持success或者loading
    		duration: 1000
    	});
	  }
	})
  },
  chooseimg:function(){
  	var that=this
  	wx.chooseImage({
	  count: 1, // 默认9
	  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	  success: function (res) {
	    console.log(res)
	    var tempFilePaths = res.tempFilePaths
	    that.setData({
	    	avatar:tempFilePaths[0],
	    	setavatar:tempFilePaths[0]
	    })
	  }
	})
  },
  relocate:function(){
  	var self=this
  	app.getCity(function(sign,city,cityname){

      if(sign==0){
        wx.showModal({
          title: '获取城市失败',
          content: '请授权后添加书籍',
          success: function(res) {

          }
        })
      }else{
        self.setData({
        	relocatename:cityname
        })
      }
    },1)
  }
})

