var webrtcCall = new WebRTCCall();

var acceptCallPopupId = "acceptCallPopup";
var hangupCallPopupId = "hangupCallPopup";
var callRefusedPopupId = "callRefusedPopup";

webrtcCall.attachLocalVideo('localVideo');
webrtcCall.attachRemoteVideo('remoteVideo');

webrtcCall.onCall(function(caller) {
  $('#' + acceptCallPopupId).modal('show').css("z-index", "1500");
});
webrtcCall.onGetUserMediaError(function() {
  console.log('Yeehaw');
});
webrtcCall.onCallRefused(function(caller) {
  $('#' + callRefusedPopupId).modal('show').css("z-index", "1500");
});
webrtcCall.onRemoteHangup(function() {
  $('#' + hangupCallPopupId).modal('show').css("z-index", "1500");
});
webrtcCall.onHangup(function() {
  $('#localVideo').attr('src', null);
});

Template.videoCall.events({
  'click #callBtn' : function(event, template) {
    console.log('User id ' + Meteor.user().username);
    var remoteUsername = template.find('#calleeUsername').value;
    webrtcCall.call(remoteUsername, null);
  },
  'click #hangupBtn' : function(event) {
    webrtcCall.hangup(function(error, result) {
      console.log('Hung up call with ' + remoteUsername);
    });
  }
});

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

