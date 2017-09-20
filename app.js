const openIdUrl = require('./config').openIdUrl
const apiUrl = require('./config').apiUrl

App({
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
    //初始化app
    this.init()
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    openid: null,
    userInfo:null,
    hasuserinfo:false,
    cityname:'',
    citycode:null
  },
  init:function(){
    //app 初始化，拿到缓存数据并按照授权情况做动作
    var openid = wx.getStorageSync('openid')
    var hasuserinfo = wx.getStorageSync('hasuserinfo')
    var hasLogin = wx.getStorageSync('hasLogin')
    var userInfo=wx.getStorageSync('userInfo')
    var cityname=wx.getStorageSync('cityname')
    var citycode=wx.getStorageSync('citycode')
    if(openid){
      this.globalData.openid=openid
    }
    if(hasLogin){
      this.globalData.hasLogin=hasLogin
    }
    if(hasuserinfo){
      this.globalData.hasuserinfo=hasuserinfo
    }
    if(userInfo){
      this.globalData.userInfo=userInfo
    }
    if(cityname){
      this.globalData.cityname=cityname
    }
    if(citycode){
      this.globalData.citycode=citycode
    }
    this.getUserOpenId(function(){});
    console.log(this.globalData)
  },
  //在全局给予判断是否授权，未授权则重新发起，已授权则直接回调
  toGetUser:function(callback){
    if(this.globalData.hasuserinfo===false){
      var that=this;
      if(this.globalData.openid===null){
        this.getUserOpenId(function(sign0,res0){
          if(sign0==1){
            that.getUserInfo(function(sign1,res1){
              if(sign1==1){
                //添加进用户表
                that.addUser();
                console.log(that.globalData)
                callback(true)
              }else{
                callback(false)
                console.log(that.globalData)
                console.log('sorry,get userinfo fail')
              }
            });
          }else{
            callback(false)
            console.log(that.globalData)
            console.log('sorry,get openid fail')
          }
        });
      }else{
        //如果已经拒绝过授权的家伙，有openid但是没有userinfo，则直接发起授权， 不再请求openid
        console.log('has openid without userinfo')
        that.getUserInfo(function(sign1,res1){
          if(sign1==1){
            //添加进用户表
            that.addUser();
            console.log(that.globalData)
            callback(true)
          }else{
            callback(false)
            console.log(that.globalData)
            console.log('sorry,get userinfo fail still')
          }
        });
      }
    }else{
      callback(true);
    }
  },
  // lazy loading openid
  getUserOpenId: function(callback) {
    var self = this
    if (self.globalData.openid) {
      console.log('already')
      callback(1,self.globalData.openid)
    } else {
      wx.login({
        success: function(data) {
          self.globalData.hasLogin=true
          wx.setStorageSync('hasLogin', true)
          wx.request({
            url: openIdUrl,
            method:'POST',
            data: {
              code: data.code
            },
            success: function(res) {
              console.log('拉取openid成功', res.data.openid)
              self.globalData.openid = res.data.openid
              wx.setStorageSync('openid', res.data.openid)
              callback(1,self.globalData.openid)
            },
            fail: function(err) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', err)
              callback(0,err)
            }
          })
        },
        fail: function(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(0,err)
        }
      })
    }
  },
  getUserInfo:function(callback){
    var self = this
    if(self.globalData.userInfo==null){
      if(self.globalData.hasLogin==false){
          wx.login({
            success: function(data) {
              self.globalData.hasLogin=true
              wx.getUserInfo({
                success: function(res) {
                  self.globalData.userInfo= res.userInfo
                  self.globalData.hasuserinfo=true
                  wx.setStorageSync('hasuserinfo', true)
                  callback(1,res.userInfo)
                  wx.setStorageSync('userInfo', res.userInfo)
                },
                fail:function(err){
                  callback(0,err)
                  console.log(err)
                }
              })
            },
            fail: function(err) {
              console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
              callback(0,err)
              console.log(err)
            }
          })
        }else{

          wx.getUserInfo({
            success: function(res) {
              self.globalData.hasLogin=true
              self.globalData.hasuserinfo=true
              self.globalData.userInfo= res.userInfo
              wx.setStorageSync('userInfo', res.userInfo)
              wx.setStorageSync('hasuserinfo', true)
              callback(1,res.userInfo)
            },
            fail:function(err){
              console.log(err)
              callback(0,err)
            }
          })
        }
      }else{
        //console.log('already')
        callback(1,self.globalData.userInfo)
      }
    
  },
  addUser:function(){

    wx.request({
      url: apiUrl+'adduser', 
      method:'POST',
      data: {
        openid:this.globalData.openid,
        name:this.globalData.userInfo.nickName,
        avatar:this.globalData.userInfo.avatarUrl,
        city:this.globalData.userInfo.city,
        country:this.globalData.userInfo.country,
        province:this.globalData.userInfo.province,
        gender:this.globalData.userInfo.gender
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res);

      },
      fail:function(err){
        console.log(err)
      }
    });
  },
  getCity:function(callback){
    var self=this
    //定位中
    wx.showLoading({
      title: '定位中',
    })
    if(self.globalData.citycode===null){
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          wx.hideLoading()
          console.log(res)
          wx.request({
            url: apiUrl+'getcity', 
            method:'POST',
            data: {
              lat:res.latitude,
              lng:res.longitude
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
              console.log(res);
              wx.setStorageSync('cityname', res.data.result.addressComponent.city)
              wx.setStorageSync('citycode', res.data.result.cityCode)
              self.globalData.cityname= res.data.result.addressComponent.city
              self.globalData.citycode= res.data.result.cityCode
              callback(1,res.data.result.cityCode)
            },
            fail:function(err){
              callback(0)
            }
          })
        },
        fail:function(err){
          wx.hideLoading()
          callback(0)
        }
      })
    }else{
      callback(1,0)
    }
    
  }
})
