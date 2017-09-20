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
      array2: [ '放上来晒命,不借','允许借阅'],
      index2: 1,
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
        console.log(res.result)
        var that=this
        wx.request({
          url: apiUrl+'scanbook', 
          method:'POST',
          data: {
            isbn:res.result
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res1) {
            console.log(res1)
            that.setData({
            	'book.title':res1.data.title,
            	'book.isbn':res1.data.isbn10+'/'+res1.data.isbn13,
            	'book.img':res1.data.images['large'],
              addbook:res1.data
            })
          },
          fail:function(err){
            console.log(err)
          }
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
      wx.request({
        url: apiUrl+'addbook', 
        method:'POST',
        data: {
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
          numRaters:that.data.addbook.rating.numRaters
        },
        
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res)
          if(res.data.code==200){
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000,
              complete:function(){
                 var pages = getCurrentPages();
                 var prevPage = pages[pages.length - 2]; //上一个页面
                 var oribooks=prevPage.data.books;
                 var orinum=prevPage.data.num;
                 var newbooks=oribooks.concat(res.data.book);
                 console.log(newbooks)
                 prevPage.setData({
                  books: newbooks,
                  num:orinum+1
                 })
                 wx.navigateBack();
              }
            })
          }else if(res.data.code==201){
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
          
        },
        fail:function(err){
          console.log(err)
          wx.showModal({
            title: '添加失败',
            content: '请稍后再试',
            success: function(res) {

            }
          })
        }
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
    if(e.detail.value==0){
      var hidden_needtoknow=true;
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

