var app = getApp()
const apiUrl = require('../../../config').apiUrl
var isscrolling=0
var isscrolling2=0
Page({
  data: {
  	title:'站内邮',
   	bar:0,
   	animationData:{},
   	recieves:[

   	],
   	sends:[

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
    this.addmoreuser(1);
    if(options.bar&&options.bar==1){
    	this.bar(2)
    }
  },
  bar:function(event){
  	if(event==2){
  		this.refresh()
  		var thisbar=1
  	}else{
  		var thisbar=event.currentTarget.dataset.bar
  	}
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
	    if(event==2){
	    	this.refresh()
	    }
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
	  		this.addmoreuser(0);
	  	}
  	}
  },
  onPullDownRefresh:function(e){
  	this.refresh()
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
	    	this.getrecieve(1);
	    }else{
	    	this.getsend(1);
	    }
	}else{
		console.log(this.data.bar)
		if(this.data.bar==0){
			if(this.data.isdone==0){
				wx.showLoading({
			        title: '正在加载',
			    })
	  		    this.getrecieve(sign);
	  		}
		}else{
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
  	app.req('getrecieve_mail',postdata,'POST',function(backsign,backdata){
  		isscrolling=0;
	    wx.hideLoading()
  		if(backsign==1){
			if(sign==0){
	            var now_recieves=that.data.recieves;
	        }else{
	        	var now_recieves=[];
	        }
	        var new_recieves=now_recieves.concat(backdata.data.data.mails);
	        that.setData({
	          recieves:new_recieves,
	          guide:backdata.data.data.guide.updated_at
	        })
  		}else{
  			wx.showToast({
				  title: '到底啦',
				  icon: 'success',
				  duration: 1200
				});
				that.setData({
					isdone:1
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
  	app.req('getsend_mail',postdata,'POST',function(backsign,backdata){
  		isscrolling2=0;
	    wx.hideLoading()
  		if(backsign==1){
			if(sign==0){
	            var now_sends=that.data.sends;
	        }else{
	        	var now_sends=[];
	        }
	        var new_sends=now_sends.concat(backdata.data.data.mails);
	        that.setData({
	          sends:new_sends,
	          guide2:backdata.data.data.guide.updated_at
	        })
	        console.log(that.data)
  		}else{
  			wx.showToast({
				  title: '到底啦',
				  icon: 'success',
				  duration: 1200
				});
				that.setData({
					isdone2:1
				})
  		}
  		wx.stopPullDownRefresh()
  	})
  }
})


