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
    wx.request({
    	url:apiUrl+'handleborrow',
    	method:'POST',
    	data:{
    		id:id
    	},
    	header:{
    		'content-type':'application/json'
    	},
    	success:function(res){
    		console.log(res)
        wx.hideLoading()
    		that.setData({
    			'info.bookimg':res.data.thebook.image_m,
    			'info.bookname':res.data.thebook.name,
    			'info.borrowname':res.data.from.name,
    			'info.gender':res.data.from.gender,
    			'info.booksnum':res.data.from.booksnum,
    			'info.time':res.data.record.updated_at,
    			'info.comment':res.data.record.comment,
    			'info.useravatar':res.data.from.avatar,
          'info.status':res.data.record.status
    		})
    	},
    	fail:function(err){
    		console.log(err)
        wx.hideLoading()
    	}
    })
  },
  handleit:function(e){
  	var choose=e.detail.target.dataset.choose;
  	app.toGetUser(function(sign){
  		if(sign){
        wx.showLoading({
          title: '正在加载',
      });
  			wx.request({
		  		url:apiUrl+'handleborrowre',
		  		method:'POST',
		  		data:{
		  			openid:app.globalData.openid,
		  			choose:choose,
            id:thisid,
            formid:e.detail.formId
		  		},
		  		header:{
		  			'content-type':'application/json'
		  		},
		  		success:function(res){
		  			console.log(res)
            wx.hideLoading()
            if(res.data.code==200){
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
            }else if(res.data.code==404){
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
		  		},
		  		fail:function(err){
		  			console.log(err)
            wx.hideLoading()
		  		}
		  	})
  		}else{
  			//
  		}
  	})
  	
  }
})

