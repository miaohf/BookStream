var app = getApp()
const apiUrl = require('../../config').apiUrl
var isscrolling=0
var isscrolling2=0
Page({
  data: {
   	title:'榜单',
   	bar:0,
   	animationData:{},
   	users:[
	   	
   	],
   	books:[
   		
   	],
   	guide:-1,
   	guide2:-1,
   	isdone:0,
   	isdone2:0,
   	scrolltop:0
    },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title:this.data.title
    })
    this.addmoreuser(0);
    this.addmorebooks(0);
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '排行榜',
      success: function(res) {},
      fail: function(res) {}
    }
  },
  bar:function(event){
  	var thisbar=event.currentTarget.dataset.bar
  	if(thisbar==0){
  		this.setData({bar:0})
  		var animation = wx.createAnimation({
	      duration: 300,
	      timingFunction: 'ease',
	    })
	    this.animation = animation
	    animation.left('50rpx').step()
	    this.setData({
	      animationData:animation.export(),
	      scrolltop:0
	    })

  	}else{
  		this.setData({bar:1})
  		var animation = wx.createAnimation({
	      duration: 300,
	      timingFunction: 'ease',
	    })
	    this.animation = animation
	    animation.left('425rpx').step()
	    this.setData({
	      animationData:animation.export(),
	      scrolltop:0
	    })
  	}
  },
  scrolldown:function(event){
	var bar=this.data.bar
  	if(bar==0){
  		if(isscrolling==0){
	  		this.addmoreuser(0);
	  	}
  	}else{
  		if(isscrolling2==0){
	  		this.addmorebooks(0);
	  	}
  	}
  },
  onReachBottom:function(){
  	console.log('bottom')
  },
  onPullDownRefresh:function(){
  	console.log('top')
  	this.refresh()
  },
  refresh:function(e){
  	var bar=this.data.bar
  	if(bar==0){
  		this.setData({
          guide:-1,
          isdone:0
        })
  		this.addmoreuser(1);
  	}else{
  		this.setData({
          guide2:-1,
          isdone2:0
        })
  		this.addmorebooks(1);
  	}
  },
  addmoreuser:function(sign){
  	isscrolling=1;
  	if(this.data.isdone==0){
  		wx.showLoading({
	        title: '正在加载',
	    })
  		var that=this
	    wx.request({
	      url: apiUrl+'orderusers', 
	      method:'POST',
	      data: {
	      	guide:this.data.guide
	      },
	      header: {
	          'content-type': 'application/json'
	      },
	      success: function(res) {
	      	isscrolling=0;
	      	console.log(isscrolling)
	      	wx.hideLoading()
	        console.log(res)
	        if(res.data.code==200){
	        	if(sign==0){
		            var noworder=that.data.users;
		        }else{
		        	var noworder=[];
		        }
		        var newusers=noworder.concat(res.data.data);
		        that.setData({
		          users:newusers,
		          guide:res.data.guide.booksnum
		        })
	        }else if(res.data.code==404){
	        	wx.showToast({
				  title: '到底啦',
				  icon: 'success',
				  duration: 1200
				});
				that.setData({
					isdone:1
				})
	        }else{
	        	wx.showModal({
	        		title:'抱歉',
	        		content:'请稍后再试',
	        		success:function(){}
	        	})
	        }
	        wx.stopPullDownRefresh()
	        
	      },
	      fail:function(err){
	      	isscrolling=0;
	      	console.log(isscrolling)
	      	wx.hideLoading()
	      	wx.showModal({
	    		title:'抱歉',
	    		content:'请稍后再试',
	    		success:function(){}
	    	})
	    	wx.stopPullDownRefresh()
	    	
	      }
	    })
  	}
  	
  },
  addmorebooks:function(sign){
  	isscrolling2=1;
  	if(this.data.isdone2==0){
  		wx.showLoading({
	        title: '正在加载',
	    })
  		var that=this
	    wx.request({
	      url: apiUrl+'orderbooks', 
	      method:'POST',
	      data: {
	      	guide:this.data.guide2
	      },
	      header: {
	          'content-type': 'application/json'
	      },
	      success: function(res) {
	      	isscrolling2=0;
	      	wx.hideLoading()
	        console.log(res)
	        if(res.data.code==200){
	        	if(sign==0){
		            var nowbook=that.data.books;
		        }else{
		        	var nowbook=[];
		        }
		        var newbooks=nowbook.concat(res.data.books);
		        that.setData({
		          books:newbooks,
		          guide2:res.data.guide
		        })
	        }else if(res.data.code==404){
	        	wx.showToast({
				  title: '到底啦',
				  icon: 'success',
				  duration: 1200
				});
				that.setData({
					isdone2:1
				})
	        }else{
	        	wx.showModal({
	        		title:'抱歉',
	        		content:'请稍后再试',
	        		success:function(){}
	        	})
	        }
	        wx.stopPullDownRefresh()
	        
	      },
	      fail:function(err){
	      	isscrolling2=0;
	      	wx.hideLoading()
	      	wx.showModal({
	    		title:'抱歉',
	    		content:'请稍后再试',
	    		success:function(){}
	    	})
	    	wx.stopPullDownRefresh()
	    	
	      }
	    })
  	}
  }
})

