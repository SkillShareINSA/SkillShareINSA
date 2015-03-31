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

    console.log(calleeRecord._id);
    Meteor.ClientCall.apply(calleeRecord._id, 'callRequest', [caller, calleeRecord._id]);
    return 'Server : Call initiated successfully !';
  },

  // forward acceptCall request to client
  acceptCall : function(caller) {
    var callerRecord = Meteor.users.findOne({username : caller});
    //Meteor.ClientCall.apply(callerRecord._id, 'acceptCall');
  },

  terminateCall : function(activeSide, passiveSide) {
    var msgLog =  'Server : ' + activeSide + ' hang up call with ' + passiveSide;
    console.log(msgLog);
    var passiveSideRecord = Meteor.users.findOne({username : passiveSide});
    Meteor.ClientCall.apply(passiveSideRecord._id, 'message', ['bye', passiveSideRecord._id]);
    return msgLog;
  },
  sendMessage : function(sender, receiver, message) {
    var msgLog =  'Server : ' + sender + ' sending message to ' + receiver + ' : ' + message;
    console.log(msgLog);
    var receiverRecord = Meteor.users.findOne({username : receiver});
    Meteor.ClientCall.apply(receiverRecord._id, 'message', [message, receiverRecord._id]);
    return msgLog;
  }
});

Meteor.publish('usersStatus', function() {
  return Meteor.users.find({}, {fields: {"status.online" : 1, emails : 1}});
});