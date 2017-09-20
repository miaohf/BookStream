var url = 'ws://地址端口';
 
function connect(user, func) {
 
 wx.connectSocket({
  url: url,
  header: {"content-type":'application/x-www-form-urlencoded'}
 });
 wx.onSocketOpen(function (res) {
  send('{"type":"login","client_name":"'+user.nickName+'","room_id":"1"}')
 });
//接受消息
 wx.onSocketMessage(func);
}
 
//发送消息
function send(msg) {
 wx.sendSocketMessage({ data: msg });
}
module.exports = {
 connect: connect,
 send: send
}