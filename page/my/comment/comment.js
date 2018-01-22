var app = getApp()
const apiUrl = require('../../../config').apiUrl
var isscrolling=0
var isscrolling2=0
Page({
  data: {
   	title:'我的评论',
   	bar:0,
   	animationData:{},
   	recieves:[
	   	
   	],
   	sends:[

   	],
   	guide:-1,
   	guide2:-1,
   	isdone:0,
   	isdone2:0
    },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title:this.data.title
    })
    this.addmoreuser(1);
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
  		console.log(isscrolling2)
  		if(isscrolling2==0){
	  		this.addmoreuser(0);
	  	}
  	}
  },
  onPullDownRefresh:function(e){
  	this.refresh();
  },
  refresh:function(){
  	var bar=this.data.bar
  	if(bar==0){
  		this.setData({
          guide:-1,
          isdone:0
        })
  		this.addmoreuser(2);
  	}else{
  		this.setData({
          guide2:-1,
          isdone2:0
        })
  		this.addmoreuser(2);
  	}
  },
  addmoreuser:function(sign){
  	console.log(sign)
	if(sign==1){
		/*第一次加载*/
		wx.showLoading({
	        title: '正在加载',
	    });
	    this.getrecieve(sign);
	    this.getsend(sign);
	}else if(sign==2){
		/*刷新*/
		wx.showLoading({
	        title: '正在加载',
	    });
	    if(this.data.bar==0){
	    	this.getrecieve(sign);
	    }else{
	    	this.getsend(sign);
	    }
	}else{
		if(this.data.bar==0){
			console.log('recieves')
			if(this.data.isdone==0){
				wx.showLoading({
			        title: '正在加载',
			    })
	  		    this.getrecieve(sign);
	  		}
		}else{
			console.log('send')
			if(this.data.isdone2==0){
				wx.showLoading({
			        title: '正在加载',
			    })
	  			this.getsend(sign);
	  		}
		} 
	}
	
  },
  getrecieve:function(sign){
  	var that=this
  	isscrolling=1;
  	var postdata={
  		guide:this.data.guide
  	}
  	app.req('getrecieve_comment',postdata,'POST',function(backsign,backdata){
  		isscrolling=0;
	    wx.hideLoading()
  		if(backsign==1){
			if(sign==0){
	            var now_recieves=that.data.recieves;
	        }else{
	        	var now_recieves=[];
	        }
	        var new_recieves=now_recieves.concat(backdata.data.data.comments);
	        that.setData({
	          recieves:new_recieves,
	          guide:backdata.data.data.guide.updated_at
	        })
  		}else if(backsign==4){
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
  	})
  },
  getsend:function(sign){
  	var that=this
  	isscrolling2=1;
  	var postdata={
  		guide:this.data.guide2
  	}
  	app.req('getsend_comment',postdata,'POST',function(backsign,backdata){
  		isscrolling2=0;
  		if(backsign==1){
  			if(sign==0){
		            var now_sends=that.data.sends;
		        }else{
		        	var now_sends=[];
		        }
		        var new_sends=now_sends.concat(backdata.data.data.comments);
		        that.setData({
		          sends:new_sends,
		          guide2:backdata.data.data.guide.updated_at
		        })
  		}else if(backsign==4){
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
  	})
  }
})

