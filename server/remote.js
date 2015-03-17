/**
 *  Remote functions that could be invoked by Meteor clients
 */
Meteor.methods({

  // WebRTC listeners
  initiateCall :function(caller, callee) {
    var msgLog = 'Server : ' + caller + ' calling ' + callee;
    console.log(msgLog);
    return msgLog;
  },
  terminateCall : function(activeSide, passiveSide) {
    var msgLog =  'Server : ' + activeSide + ' hang up call with ' + passiveSide;
    console.log(msgLog);
    return msgLog;
  },
  sendMessage : function(sender, receiver, message) {
    var msgLog =  'Server : ' + sender + ' sending message to ' + receiver + ' : ' + message;
    console.log(msgLog);
    return msgLog;
  }
});