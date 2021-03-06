var app = getApp();
const apiUrl = require('../../../config').apiUrl;
Page({
  data: {
    book:{
        letternum:20000,
        bollownum:510,
      },
    reader:{},
    comments:[
      
    ],
    recomand:[

    ],
    commonjs:{
      desheight:'120rpx',
      direction:'down',
      desl_color:'#999'
    },
    hascomment:0,
    addcomment:{},
    animationData:'',
    animationData2:'',
    animationData3:'',
    commentvalue:'',
    is_comment_panel:true,
    is_average_panel:true,
    is_borrow_panel:true,
    nowstarnum:1,
    stars:[{starnum:1},{starnum:2},{starnum:3},{starnum:4},{starnum:5},{starnum:6},{starnum:7},{starnum:8},{starnum:9},{starnum:10}],
    greystar:'/image/book/star_grey.png',
    yellowstar:'/image/book/star_yellow.png',
    hasstar:false,
    borrower:[],
    ilike:0
    },
  onLoad: function(options) {
    if(options.id){
      wx.showLoading({
          title: '正在加载',
      });
      var that=this
      var postdata={
        id:options.id,
        openid:app.globalData.openid
      }
      app.req('thebook',postdata,'POST',function(backsign,backdata){
        if(backsign==1){
          wx.hideLoading()
          that.setData({
            book:backdata.data.data.book,
            comments:backdata.data.data.comments,
            hasstar:backdata.data.data.star.hasstar,
            nowstarnum:backdata.data.data.star.nowstarnum,
            ilike:backdata.data.data.ilike
          });
          wx.setNavigationBarTitle({
            title:that.data.book.name
          });
          if(backdata.data.data.borrower){
            that.setData({
              borrower:backdata.data.data.borrower
            })
            console.log(that.data)
          }
        }else{
          wx.hideLoading()
        }
      })
    }else{
      wx.showModal({
        title: "抱歉",
        content: "参数错误，请稍后再试！",
        success: function(res) {
          wx.navigateBack({
            delta: -1
          });
        }
      });
    }
    

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: this.data.book.name,
      success: function(res) {},
      fail: function(res) {}
    }
  },
  showall:function(){
    var commonjs=this.data.commonjs;
    if(commonjs['desheight']==''){
      commonjs['desheight']='120rpx';
      commonjs['direction']='down';
      commonjs['desl_color']='#999';
    }else{
      commonjs['desheight']='';
      commonjs['direction']='up';
      commonjs['desl_color']='#555';
    }
    
    this.setData({
      commonjs:commonjs
    });
  },
  alertcommentbox:function(event){
    var that=this
    var app = getApp()
    app.getUserInfo(function(sign){
      if(sign){
        console.log('弹出评论框')
        that.setData({
          is_comment_panel:false
        })
        var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
        })
        
        that.animation = animation
        animation.translateY(-111).step()
        that.setData({
          animationData:animation.export()
        })

      }else{
        wx.showModal({
          title: '抱歉',
          content: '无法得到授权，请稍后再试',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
    console.log(app.globalData.userInfo);

  },
  hidecommentbox:function(){
    var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
        })
    this.setData({
      is_comment_panel:true
    })
    this.animation = animation
    animation.translateY(111).step()
    this.setData({
      animationData:animation.export(),
      commentvalue:''
    })
  },
  sendcomment:function(e){
    var that=this
    console.log(that.data.book)
    if(e.detail.value.comment!=''){
      wx.showLoading({
          title: '正在加载',
      });
      //request
      var postdata={
        bookid:that.data.book.id,
        comment:e.detail.value.comment,
        openid:app.globalData.openid,
        name:app.globalData.userInfo.nickName,
        avatar:app.globalData.userInfo.avatarUrl
      }
      app.req('addcomment',postdata,'POST',function(backsign,backdata){
        if(backsign==1){
          wx.hideLoading()
          that.hidecommentbox();
          var oricomment=that.data.comments;
          var newcomment=oricomment.concat(backdata.data.data);
          that.setData({
            comments:newcomment
          })
        }else{
           wx.hideLoading()
        }
      })
    }else{
      console.log('please input')
    }
  },
  cancel_addcomment:function(){
    this.setData({
      hascomment:0
    });
  },
  catchit:function(){

  },
  takestar:function(){
    var that=this
    app.getUserInfo(function(sign){
      if(sign){
        console.log('star')
        that.setData({
          is_average_panel:false
        })
        var animation = wx.createAnimation({
              duration: 1000,
              timingFunction: 'ease',
            })
            
        that.animation = animation
        animation.translateY(-100).step()
        that.setData({
          animationData2:animation.export()
        })

      }else{
        wx.showModal({
          title: '抱歉',
          content: '无法得到授权，请稍后再试',
          success: function(res) {

          }
        })
      }
    })

  },
  hideaveragebox:function(){
    var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
        })
    this.setData({
      is_average_panel:true
    })
    this.animation = animation
    animation.translateY(100).step()
    this.setData({
      animationData2:animation.export(),
      averagevalue:''
    })
  },
  clickstar:function(e){
    var starnum=e.currentTarget.dataset.star;
    this.setData({
      nowstarnum:starnum
    })
    console.log(this.data.nowstarnum)
  },
  scoreit:function(){
    var nowstarnum=this.data.nowstarnum;
    var that=this;
    wx.showLoading({
          title: '正在加载',
      });
    var postdata={
      openid:app.globalData.openid,
      bookid:that.data.book.id,
      star:nowstarnum
    }
    app.req('scoreit',postdata,'POST',function(backsign,backdata){
      if(backsign==1){
        wx.hideLoading()
          wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000,
              complete:function(){
                  that.hideaveragebox();
                  that.setData({
                    'book.numRaters':that.data.book.numRaters+1,
                    hasstar:true
                  });
              }
            })
       
      }else if(backsign==2){
        wx.hideLoading()
        wx.showModal({
            title: '抱歉',
            content: '您已经评过星啦',
            success: function(res) {

            }
          })
      }else{
        wx.hideLoading()
        wx.showModal({
            title: '抱歉',
            content: '评星失败，请稍后再试',
            success: function(res) {

            }
          })
      }
    })
  },
  likeit:function(){
    var that=this;
    wx.showLoading({
          title: '正在加载',
      });
    var postdata={
      bookid:that.data.book.id
    }
    app.req('likeit',postdata,'POST',function(backsign,backdata){
      if(backsign==1){
        wx.hideLoading()
        if(that.data.ilike==0){
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 1500,
            complete:function(){
                that.setData({
                  ilike:1
                });
            }
          })
        }else{
          wx.showToast({
            title: '取消赞成功',
            icon: 'success',
            duration: 1500,
            complete:function(){
                that.setData({
                  ilike:0
                });
            }
          })
        }
          
       
      }else{
        wx.hideLoading()
        wx.showModal({
            title: '抱歉',
            content: '操作失败，请稍后再试',
            success: function(res) {

            }
          })
      }
    })
  },
  iwantborrow:function(e){
    var that=this
    var app = getApp()
    app.getUserInfo(function(sign){
      if(sign){
        console.log('弹出借书框')
        that.setData({
          is_borrow_panel:false
        })
        var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
        })
        
        that.animation = animation
        animation.translateY(-100).step()
        that.setData({
          animationData3:animation.export()
        })

      }else{
        wx.showModal({
          title: '抱歉',
          content: '无法得到授权，请稍后再试',
          success: function(res) {
            if (backdata.confirm) {
              console.log('用户点击确定')
            } else if (backdata.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  hideborrowbox:function(e){
    var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
        })
    this.setData({
      is_borrow_panel:true
    })
    this.animation = animation
    animation.translateY(100).step()
    this.setData({
      animationData3:animation.export(),
      borrowvalue:''
    })
  },
  borrowit:function(e){
    var that=this
    console.log(e)
    if(e.detail.value.borrow!=''){

      wx.showLoading({
          title: '正在提交',
      })

      var postdata={
        bookid:that.data.book.id,
        comment:e.detail.value.borrow,
        openid:app.globalData.openid,
        name:app.globalData.userInfo.nickName,
        avatar:app.globalData.userInfo.avatarUrl,
        formid:e.detail.formId,
        citycode:app.globalData.citycode
      }
      app.req('borrowit',postdata,'POST',function(backsign,backdata){
        if(backsign==1){
          wx.hideLoading()
          that.hideborrowbox();
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
        }else{
          wx.hideLoading()
          wx.showModal({
            title: '失败',
            content: '请稍后再试',
            success: function(res) {
              that.hideborrowbox();
            }
          })
        }
      })
    }else{
      console.log('please input')
      wx.showModal({
        title: '失败',
        content: '请填写留言',
        success: function(res) {

        }
      })
    }
  }
})

