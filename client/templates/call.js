webrtcCall = new WebRTCCall();

var acceptCallPopupId = "acceptCallPopup";
var hangupCallPopupId = "hangupCallPopup";
var callRefusedPopupId = "callRefusedPopup";

webrtcCall.attachLocalVideo('localVideo');
webrtcCall.attachRemoteVideo('remoteVideo');

webrtcCall.onCall(function(caller) {
  $('#' + acceptCallPopupId).modal('show').css("z-index", "1500");
});
webrtcCall.onGetUserMediaError(function() {
  alert("Erreur d'acces a votre video");
});
webrtcCall.onCallRefused(function(caller) {
  $('#' + callRefusedPopupId).modal('show').css("z-index", "1500");
});
webrtcCall.onRemoteHangup(function() {
  $('#dataChannelReceive').attr('disabled', 'disabled');
  
  $('#dataChannelReceive').attr('placeholder', '');
  $('#sendDataBtn').attr('disabled', 'disabled');
  $('#' + hangupCallPopupId).modal('show').css("z-index", "1500");
});
webrtcCall.onHangup(function() {
  $('#localVideo').attr('src', null);
  $('#dataChannelReceive').attr('disabled', 'disabled');
  $('#sendDataBtn').attr('disabled', 'disabled');
});
webrtcCall.onDataChannelReady(function() {
  $('#dataChannelReceive').attr('disabled', false);
  $('#dataChannelReceive').attr('placeholder', '');
  $('#sendDataBtn').attr('disabled', false);
});

webrtcCall.onDataChannelMessage(function(data) {
    $('#dataChannelReceive').text(data);
});

chatStream = new Meteor.Stream('chat');
if(Meteor.isClient) {
  sendChat = function(message) {
    chatStream.emit('message', message);
    console.log('me: ' + message);
  };

  chatStream.on('message', function(message) {
    console.log('user: ' + message);
  });
}

Template.videoCall.onRendered(function() {
  var self = this;
  Tracker.autorun(function() {
    if (Session.get('users_loaded')) {
      // page called with style /call/userId
      if (self.data && self.data.userId) {
        makeCall(self.data.userId);
      }
    }
  });
});
Template.videoCall.events({
  'click #callBtn' : function(event, template) {
    console.log('User id ' + Meteor.user().username);
    var remoteUsername = template.find('#calleeUsername').value;
    makeCall(remoteUsername);
  },
  'click #hangupBtn' : function(event) {
    webrtcCall.hangup(function(error, result) {
      console.log('Hung up call with ' + Session.get('callmate'));
    });
  },
  'click #sendDataBtn' : function(event) {
    var data = $('#dataChannelReceive').val();
    webrtcCall.sendData(data, function() {
      console.log('Sent ' + data);
    });
  }
});

var makeCall = function(remoteUsername) {
  Session.set('callmate', remoteUsername);
  console.log('Calling ' + remoteUsername);
  webrtcCall.call(remoteUsername, function(result) {
    if (result.error) {
      console.log(result.error);
    }
  });
  //$('#calleeUsername').hide();
  //$('#callBtn').hide();
}

Template.acceptCallPopup.helpers({
  caller : function() {
    return Session.get('caller');
  },
  popupId : function() {
    return acceptCallPopupId;
  }
});

Template.acceptCallPopup.events({
  'click #confirmButton' : function() {
    webrtcCall.acceptCall(function(caller) {
      $('#' + acceptCallPopupId).modal('hide');
      Session.set('callmate', caller);
    });
  },
  'click #cancelButton' : function() {
    webrtcCall.refuseCall(function(caller) {
      $('#' + acceptCallPopupId).modal('hide');
    })
  }
});

Template.callRefusedPopup.helpers({
  popupId : function() {
    return callRefusedPopupId;
  }
});

Template.callRefusedPopup.events({
  'click #confirmButton' : function() {
    $('#' + callRefusedPopupId).modal('hide');
  }
});

Template.hangupCallPopup.events({
  'click #confirmButton' : function() {
    $('#' + hangupCallPopupId).modal('hide');
  }
});

// define helper for conveniently get other participant username
// without template-specific helpers
Handlebars.registerHelper('callmate',function(input){
  return Session.get("callmate");
});