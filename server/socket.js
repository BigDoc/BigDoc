module.exports.socketIOinit = socketIOinit;
module.exports.sendRequestToClient = sendRequestToClient;

var db = require('./db');
var socketListeners = {};
var clientListeners = {};

function socketIOinit(io)
{
  console.log("running on port");
  //python client connects
  io.on('connection',function(socket){
    // socketListeners
    // call this immediately on PC client
    socket.on('registerListener',function(data){
      console.log("uid: " + data['UID']);
      var uuid = data['UID'];
      if (!socketListeners[uuid]) {
        socketListeners[uuid] = [];
      }
      socketListeners[uuid].push(socket);
    });

  });
}

function sendRequestToClient(type, data, uuid) {
  if (socketListeners[uuid]) {
    socketListeners[uuid].forEach(function(socket) {
      socket.emit(type, data);
    });
  }
}
