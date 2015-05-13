/**
 *  Remote functions that could be invoked by Meteor clients
 */
Accounts.registerLoginHandler(function(login_requested) {
    var url = "http://localhost/callCAS/is_connected.php";
    var user_name = login_requested.username;

    console.log("HANDLER +++++++");

    console.log(url);

    HTTP.get(url, {params: {is_connected: user_name}}, function (error, result) {
      if (!error) {
        if (result.content == 1) {
          console.log("METEOR : User " + user_name + " is connect");
          /★ Si l'utilisateur n'existe pas, on le créee ★/
          if (Meteor.users.find({username:user_name}).fetch().length == 0) {
            /★ Creation du compte ★/
            Accounts.createUser({username:user_name,password : "123"},null);
                  //console.log("$$$$$$An online : " +Meteor.users.find({username:user_name}).fetch()[0].status.online);
            }

                /★ Connexion de l'utilisateur ★/
                Meteor.users.update(
                  {username : user_name},
                  {$set: 
                    {status: {
                      online : true}
                    }
                  }
                  );

                console.log("rprevost : online :"+ Meteor.users.find({username:user_name}).fetch()[0].status.online 
                  + " ," + Meteor.users.find({username:user_name}).fetch()[0]._id);

                  //creating the token and adding to the user
                  var stampedToken = Accounts._generateStampedLoginToken();
                  //hashing is something added with Meteor 0.7.x, 
                  //you don't need to do hashing in previous versions
                  var hashStampedToken = Accounts._hashStampedToken(stampedToken);
                  
                  var userId = Meteor.users.find({username:user_name}).fetch()[0]._id;

                  Meteor.users.update(userId, 
                    {$push: {'services.resume.loginTokens': hashStampedToken}}
                  );

                  //sending token along with the userId
                  return {
                    id: userId,
                    token: stampedToken.token
                  }

              }
              else {
                console.log("METEOR : User " + user_name + " is not connected");
                return null;
              }
            }
            else {
              console.log("error : "+ error);
              return null;
            }
          });
}
);

 Meteor.methods({

  /* webrtc-call.js methods */
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

  /* higher level methods (call.js) */
  hideVideo : function(sender, receiver) {
    var msgLog =  'Server : ' + sender + ' requests ' + receiver + ' to turn video off ';
    console.log(msgLog);
    var receiverRecord = Meteor.users.findOne({username : receiver});
    Meteor.ClientCall.apply(receiverRecord._id, 'hideVideo', [sender]);
  },
  displayVideo : function(sender, receiver) {
    var msgLog =  'Server : ' + sender + ' requests ' + receiver + ' to turn video on ';
    console.log(msgLog);
    var receiverRecord = Meteor.users.findOne({username : receiver});
    Meteor.ClientCall.apply(receiverRecord._id, 'displayVideo', [sender]);
  },   
  muteAudio : function(sender, receiver) {
    var msgLog =  'Server : ' + sender + ' requests ' + receiver + ' to mute sound ';
    console.log(msgLog);
    var receiverRecord = Meteor.users.findOne({username : receiver});
    Meteor.ClientCall.apply(receiverRecord._id, 'mute', [sender]);
  },
  unmuteAudio : function(sender, receiver) {
    var msgLog =  'Server : ' + sender + ' requests ' + receiver + ' to unmute sound ';
    console.log(msgLog);
    var receiverRecord = Meteor.users.findOne({username : receiver});
    Meteor.ClientCall.apply(receiverRecord._id, 'unmute', [sender]);
  }, 

  logout_requested : function (user_name) {
      var url = "http://localhost/callCAS/disconnect.php";

      console.log(url);

      HTTP.get(url, {params: {user: user_name}});
  },

  login_requested : function (user_name) {
    var url = "http://localhost/callCAS/is_connected.php";

    console.log(url);

    HTTP.get(url, {params: {is_connected: user_name}}, function (error, result) {
      if (!error) {
        if (result.content == 1) {
          console.log("METEOR : User " + user_name + " is connect");
          /★ Si l'utilisateur n'existe pas, on le créee ★/
          if (Meteor.users.find({username:user_name}).fetch().length == 0) {
            /★ Creation du compte ★/
            Accounts.createUser({username:user_name,password : "123"},null);
                  //console.log("$$$$$$An online : " +Meteor.users.find({username:user_name}).fetch()[0].status.online);
                }

                /★ Connexion de l'utilisateur ★/
                Meteor.users.update(
                  {username : user_name},
                  {$set: 
                    {status: {
                      online : true}
                    }
                  }
                  );

                console.log("rprevost : online :"+ Meteor.users.find({username:user_name}).fetch()[0].status.online);

                return true;
              }
              else {
                console.log("METEOR : User " + user_name + " is not connected");
                return false;
              }
            }
            else {
              console.log("error : "+ error);
            }
          });
}
});