const apiUrl = require('../../../config').apiUrl
var app = getApp()
Page({
  data: {
   		title:'添加书籍',
   		book:{
   			title:'点击上方按钮添加',
   			isbn:'点击上方按钮添加',
        img:''
   		},
      addbook:'',
      array: [ '文学','流行','文化','生活','经营','科技','其他'],
      index: 0,
      array2: [ '对外借阅','图书漂流'],
      index2: 0,
      hidden_needtoknow:false
    },
  onLoad: function(options) {
    if(app.globalData.openid){
      console.log(app.globalData.openid)
    }else{
      app.getUserOpenId()
    }
    wx.setNavigationBarTitle({
      title:this.data.title
    })
  },
  scan:function(){
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var that=this
        wx.showLoading({
          title: '正在加载',
        });
        var postdata={
          isbn:res.result
        }
        app.req('scanbook',postdata,'POST',function(backsign,backdata){
          if(backsign==-1){
            wx.showModal({
                title: '查询本书失败',
                content: '请稍后再试',
                success: function(res) {
                }
              })
          }else{
            if(backdata.data.id){
              that.setData({
                'book.title':backdata.data.title,
                'book.isbn':backdata.data.isbn10+'/'+backdata.data.isbn13,
                'book.img':backdata.data.images['large'],
                addbook:backdata.data
              })
            }else{
              wx.showModal({
                title: '查询本书失败',
                content: '请稍后再试',
                success: function(res) {
                }
              })
            }
          }
          wx.hideLoading()
        })

      }
    })
  },
  addbook:function(e){
    console.log(e)
    if(this.data.addbook==''){
      wx.showModal({
        title: '抱歉',
        content: '您还未添加书籍，请点击页面顶部添加按钮添加！',
        success: function(res) {
         
        }
      })
    }else{
      var that=this
      wx.showLoading({
          title: '正在加载',
      });
      var postdata={
        isbn10:that.data.addbook.isbn10,
          isbn13:that.data.addbook.isbn13,
          images_s:that.data.addbook.images.small,
          images_m:that.data.addbook.images.medium,
          images_l:that.data.addbook.images.large,
          title:that.data.addbook.title,
          summary:that.data.addbook.summary,
          subtitle:that.data.addbook.subtitle,
          publish:that.data.addbook.publisher,
          catalog:that.data.addbook.catalog,
          author:that.data.addbook.author.toString(),
          tags:JSON.stringify(that.data.addbook.tags),
          openid:app.globalData.openid,
          story:e.detail.value.story,
          price:that.data.addbook.price,
          pubdate:that.data.addbook.pubdate,
          status:e.detail.value.picker2,
          kind:e.detail.value.picker1,
          needtoknow:e.detail.value.needtoknow,
          citycode:app.globalData.citycode,
          cityname:app.globalData.cityname,
          average:that.data.addbook.rating.average,
          numRaters:that.data.addbook.rating.numRaters,
          drift:that.data.index2
      }
      app.req('addbook',postdata,'POST',function(backsign,backdata){
        if(backsign==1){
          wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000,
              complete:function(){
                 var pages = getCurrentPages();
                 var prevPage = pages[pages.length - 2]; //上一个页面
                 var oribooks=prevPage.data.books;
                 var orinum=prevPage.data.num;
                 var newbooks=oribooks.concat(backdata.data.data);
                 console.log(newbooks)
                 prevPage.setData({
                  books: newbooks,
                  num:orinum+1
                 })

                var prepage1=pages[pages.length-3]
                var my=prepage1.data.my
                var mybook=my
                mybook.booknum=my.booknum+1
                prepage1.setData({
                  my:mybook
                })
                 wx.navigateBack();
              }
            })
        }else if(backsign==2){
           wx.showModal({
              title: '添加失败',
              content: '同一本书最多只能添加3本哦',
              success: function(res) {

              }
            })
         }else{
          wx.showModal({
              title: '添加失败',
              content: '请稍后再试',
              success: function(res) {

              }
            })
         }
        wx.hideLoading()
      })
    }
    
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange2: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if(e.detail.value==1){
      var hidden_needtoknow=true;
      wx.showModal({
        title: "确定",
        content: "选择图书漂流将放弃您的书本所有权，漂流收取者将拥有这本书，您确定选择图书漂流吗？",
        showCancel: true,
        confirmText: "确定",
        confirmColor: "#3CC51F"
      });
    }else{
      var hidden_needtoknow=false;
    }
    this.setData({
      index2: e.detail.value,
      hidden_needtoknow:hidden_needtoknow
    })
    console.log(this.data.hidden_needtoknow)

  }
})

