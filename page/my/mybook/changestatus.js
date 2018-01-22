var app = getApp()
const apiUrl = require('../../../config').apiUrl
var status,id,index='';
var havechange=0;
Page({
  data: {
   title:'设置书本状态',
   statusitems: [
      {name: 'set0', value: '该书已回收并不再借出'},
      {name: 'set1', value: '该书已回收并可借出', checked: 'true'}
    ]
    },
  onLoad: function(options) {
  	id=options.id;
  	status=options.status;
  	index=options.index;
  	this.setData({
  		status:status
  	})
    wx.setNavigationBarTitle({
      title:this.data.title
    })
    console.log(id+','+status+','+index+','+havechange)
  },
  onShow:function(){
  	havechange=0;
  	if(status==3){
    	status=1;
    	havechange=1;
    }
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    havechange=1;
    if(e.detail.value=='set0'){
    	status=0;
    }else{
    	status=1;
    }
  },
  setit:function(){
  	console.log(status+','+havechange)
  	if((status==-1)||(havechange==0)){
  		wx.showModal({
  			title: "抱歉",
  			content: "您没有更改状态，无需提交",
  			success: function(res) {
  				
  			}
  		});
  	}else{
  		wx.showLoading({
          title: '正在提交',
      	})
      var postdata={
        bookid:id,
        status:status
      }
      app.req('setbookstatus',postdata,'POST',function(backsign,backdata){
        if(backsign==1){
          wx.showModal({
              title: "成功",
              content: "提交成功",
              success: function(res) {
                var pages=getCurrentPages();
                var prepage=pages[pages.length-2]
                var books=prepage.data.books
                books[index].status=status;
                prepage.setData({
                  books:books
                })
                wx.navigateBack({
                  delta: 1
                });
              }
            });
        }else{
          wx.showModal({
              title: "抱歉",
              content: "提交失败，请稍后再试",
              success: function(res) {
                
              }
            });
        }
        wx.hideLoading()
      })
  	}
  	
  },
  switch1Change: function (e){
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    havechange=1;
    if(e.detail.value==false){
    	status=-1;
    }else{
    	status=1;
    }
  },
  switch2Change: function (e){
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    havechange=1;
    if(e.detail.value==false){
    	status=-1;
    }else{
    	status=0;
    }
  },
  switch3Change: function (e){
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    havechange=1;
    if(e.detail.value==false){
    	status=-1;
    }else{
    	status=3;
    }
    console.log(status)
  }
})

