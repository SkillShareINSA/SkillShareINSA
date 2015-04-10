/**
 *  Remote functions that could be invoked by Meteor clients
 */
Meteor.methods({

  // forward initiateCall request to client (callRequest)
  initiateCall :function(caller, callee) {
    console.log('Server : ' + caller + ' calling ' + callee);
    if (!caller == Meteor.user().username) {
      console.log('Malicious caller : ' + caller);
      throw new Meteor.Error('invalid-callee');
    }

    var calleeRecord = Meteor.users.findOne({username : callee});
    if (!calleeRecord) {
      console.log('Unknown callee : ' + call-Record);
      throw new Meteor.Error('unknown-callee');
    }
    if (!calleeRecord.status.online) {
      console.log('Attempt of ' + caller + ' to call offline user ' + callee);
      throw new Meteor.Error('offline-callee');
    }
    Meteor.ClientCall.apply(calleeRecord._id, 'callRequested', [caller]);
    return 'Server : Call initiated successfully !';
  },

  acceptCall : function(caller) {
    var callerRecord = Meteor.users.findOne({username : caller});
    Meteor.ClientCall.apply(callerRecord._id, 'callAccepted');
  },
  refuseCall : function(caller) {
    var callerRecord = Meteor.users.findOne({username : caller});
    Meteor.ClientCall.apply(callerRecord._id, 'callRefused');
  },

  terminateCall : function(activeSide, passiveSide) {
    var msgLog =  'Server : ' + activeSide + ' hang up call with ' + passiveSide;
    console.log(msgLog);
    var passiveSideRecord = Meteor.users.findOne({username : passiveSide});
    Meteor.ClientCall.apply(passiveSideRecord._id, 'message', ['bye']);
    return msgLog;
  },
  sendMessage : function(sender, receiver, message) {
    var msgLog =  'Server : ' + sender + ' sending message to ' + receiver + ' : ' + message;
    console.log(msgLog);
    var receiverRecord = Meteor.users.findOne({username : receiver});
    Meteor.ClientCall.apply(receiverRecord._id, 'message', [message]);
    return msgLog;
  },

  login_requested : function (user_name) {
        var url = "http://localhost/callCAS/is_connected.php";

        console.log(url);

        HTTP.get(url, {params: {is_connected: user_name}}, function (error, result) {
            if (!error) {
              if (result.content == 1) {
                console.log("User " + user_name + " is connect");
              }
              else {
                console.log("User " + user_name + " is not connected");
              }
            }
            else {
              console.log("error : "+ error);
            }
          });
    }
});