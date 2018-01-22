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
    openid: null,
    thirdSession:null,
    userInfo:null,
    hasuserinfo:false,
    cityname:'',
    citycode:null,
    onlycity:0
  },
  init:function(){
    //app 初始化，拿到缓存数据并按照授权情况做动作
    var openid = wx.getStorageSync('openid')
    var thirdSession = wx.getStorageSync('thirdSession')
    var hasuserinfo = wx.getStorageSync('hasuserinfo')
    var userInfo=wx.getStorageSync('userInfo')
    var cityname=wx.getStorageSync('cityname')
    var citycode=wx.getStorageSync('citycode')
    var onlycity=wx.getStorageSync('onlycity')

    if(openid){
      this.globalData.openid=openid
    }
    if(thirdSession){
      this.globalData.thirdSession=thirdSession
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
    if(onlycity){
      this.globalData.onlycity=onlycity
    }
    this.getLogin(function(){});
    console.log(this.globalData)
  },
  getLogin: function(callback) {
    var self = this
    wx.checkSession({
      success: function(res) {
        console.log(res)
        //如果本地缓存被某种方式可以清除，这里就需要再次判断本地缓存的session，若空，重新login
        //如果多端登录，微信服务器表示已授权而本地没有授权信息，重新login
        if(self.globalData.thirdSession==null){
          wx.login({
            success: function(data) {
              console.log(data)
              var postdata={code:data.code};
              self.req('login',postdata,'POST',function(sign,backdata){
                if(sign==1){
                  console.log('登陆成功！',backdata)
                  self.globalData.openid = backdata.data.data.openid
                  wx.setStorageSync('openid', backdata.data.data.openid)
                  self.globalData.thirdSession = backdata.data.data.thirdSession
                  wx.setStorageSync('thirdSession', backdata.data.data.thirdSession)
                  callback(1)
                }else{
                  console.log('登录失败，将无法正常使用开放接口等服务', backdata)
                  callback(0)
                }
              })
            },
            fail: function(err) {
              console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
              callback(0)
            }
          })
        }else{
          callback(1)
        }
      },
      fail: function (res) {
        wx.login({
            success: function(data) {
              console.log(data)
              var postdata={code:data.code};
              self.req('login',postdata,'POST',function(sign,backdata){
                if(sign==1){
                  console.log('登陆成功！',backdata)
                  self.globalData.openid = backdata.data.data.openid
                  wx.setStorageSync('openid', backdata.data.data.openid)
                  self.globalData.thirdSession = backdata.data.data.thirdSession
                  wx.setStorageSync('thirdSession', backdata.data.data.thirdSession)
                  callback(1)
                }else{
                  console.log('登录失败，将无法正常使用开放接口等服务', backdata)
                  callback(0)
                }
              })
            },
            fail: function(err) {
              console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
              callback(0)
            }
          })
        //console.log(self.globalData)
      }
    });
  },
  getUserInfo:function(callback){
    //各页面调用此方法，以验证用户是否授权
    var self = this
    this.getLogin(function(sign){
      if(sign==0){
        callback(0);
      }else{
        if(self.globalData.userInfo==null){
            wx.getUserInfo({
                success: function(res) {
                  self.globalData.userInfo= res.userInfo
                  self.globalData.hasuserinfo=true
                  wx.setStorageSync('hasuserinfo', true)
                  wx.setStorageSync('userInfo', res.userInfo)
                  self.addUser()
                  callback(1)
                },
                fail:function(err){
                  callback(0)
                  console.log(err)
                }
            })
          }else{
            callback(1)
        }
      }
    });

  },
  addUser:function(){
    //每次授权后添加用户，若存在，后台判断后不操作
    var self = this
    var data={
        openid:this.globalData.openid,
        name:this.globalData.userInfo.nickName,
        avatar:this.globalData.userInfo.avatarUrl,
        country:this.globalData.userInfo.country,
        city:this.globalData.userInfo.city,
        province:this.globalData.userInfo.province,
        gender:this.globalData.userInfo.gender
      };
    self.req('adduser',data,'POST',function(sign,backdata){
      //
    })
  },
  req:function(api,data,method,callback){
    //请求接口和处理返回的统一方法
    var theapp=this
    wx.request({
      url: apiUrl+api,
      method:method,
      data: data,
      header: {
          'Content-Type': 'application/json',
          'thirdSession':theapp.globalData.thirdSession
      },
      success: function(res) {
        console.log(res)
        callback(res.data.status,res)
      },
      fail: function(res) {
        console.log(res)
        callback(-1,res)
      }
    })
  },
  getCity:function(callback,sign){
    //sign==1时是relocate
    console.log(this.globalData)
    var self=this
    //定位中
    wx.showLoading({
      title: '定位中',
    })
    if((self.globalData.citycode===null)||(sign==1)){
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          wx.hideLoading()
          console.log(res)
          var postdata={
            lat:res.latitude,
            lng:res.longitude
          }
          self.req('getcity',postdata,'POST',function(backsign,backdata){

              wx.setStorageSync('cityname', backdata.data.result.addressComponent.city)
              wx.setStorageSync('citycode', backdata.data.result.cityCode)
              self.globalData.cityname= backdata.data.result.addressComponent.city
              self.globalData.citycode= backdata.data.result.cityCode
              callback(1,backdata.data.result.cityCode,backdata.data.result.addressComponent.city)

          })
        },
        fail:function(err){
          wx.hideLoading()
          callback(0)
        }
      })
    }else{
      wx.hideLoading()
      callback(1,self.globalData.citycode,self.globalData.cityname)
    }
    
  }
});