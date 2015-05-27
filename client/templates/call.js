var webrtcCall = new WebRTCCall();

var acceptCallPopupId = "acceptCallPopup";
var hangupCallPopupId = "hangupCallPopup";
var callRefusedPopupId = "callRefusedPopup";

webrtcCall.attachLocalVideo('localVideo');
webrtcCall.attachRemoteVideo('remoteVideo');

// Global call state
var callState = {
  status  :  "idle",         // calling, idle
  video   :  "off",          // on, off
  audio   :  "off"           // on, off
}

function resetCallState() {
  callState.status = "idle";
  callState.video = "off";
  callState.audio = "off";
  $('i#fa-camera').removeClass('fa-video-camera-slash')
            .addClass('fa-video-camera');
  $('i#fa-microphone').addClass('fa-microphone')
      .removeClass('fa-microphone-slash'); 
}

function callingCallState() {
  callState.status = "calling";
  callState.video = "on";
  callState.audio = "on";
  $('i#fa-camera').removeClass('fa-video-camera-slash')
            .addClass('fa-video-camera');
  $('i#fa-microphone').addClass('fa-microphone')
      .removeClass('fa-microphone-slash'); 
}

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
  $('#localVideo').attr('src', null);
  $('#remoteVideo').attr('src', null);
  $('#videoCenterInfo').addClass('hidden');
  resetCallState();
});

Template.videoCall.onRendered(function() {
  var self = this;
  Tracker.autorun(function() {
    if (Session.get('users_loaded')) {
      // page called with style /call/userId
      if (self.data && self.data.userId) {
        makeCall(self.data.userId);
        Session.set('callmate', self.data.userId);
      }
    } else {
      return false;
    }
  });
});
Template.videoCall.events({
  'click #callBtn' : function(event, template) {
    //console.log('User id ' + Meteor.user().username);
    //var remoteUsername = template.find('#calleeUsername').value;
    makeCall(Session.get('callmate'));
  },
  'click #hangupBtn' : function(event) {
    webrtcCall.hangup(function(error, result) {
      $('#localVideo').attr('src', null);
      $('#remoteVideo').attr('src', null);
      $('#videoCenterInfo').addClass('hidden');
      resetCallState();
      console.log('Hung up call with ' + Session.get('callmate'));
    });
  }
});

Template.videoWindow.events({
  'click i.fa-arrows-alt' : function(event) {
    $('#videoWindow').toggleClass('full-screen');
  },
  'click i#fa-microphone' : function(event) {
      if (callState.audio === "on") {
        Meteor.call('muteAudio', Meteor.user().username, Session.get('callmate'), function(err, res) {
        if (!err) {
          callState.audio = "off";
          $(event.target).removeClass('fa-video-microphone')
            .addClass('fa-microphone-slash');
        }
      });   
     } else {
        Meteor.call('unmuteAudio', Meteor.user().username, Session.get('callmate'), function(err, res) {
        if (!err) {
          callState.audio = "on";
          $(event.target).addClass('fa-video-microphone')
            .removeClass('fa-microphone-slash');
        }
      });
     }
  },
  'click i#fa-camera' : function(event) {
    if (callState.video === "on") {
      Meteor.call('hideVideo', Meteor.user().username, Session.get('callmate'), function(err, res) {
        if (!err) {
          callState.video = "off";
          $(event.target).removeClass('fa-video-camera')
            .addClass('fa-custom-camera-slash');
          $('#localVideo').addClass('hidden');
        }
      });
    } else {
      Meteor.call('displayVideo', Meteor.user().username, Session.get('callmate'), function(err, res) {
        if (!err) {
          callState.video = "on";
          $(event.target).addClass('fa-video-camera')
            .removeClass('fa-custom-camera-slash');
            $('#localVideo').removeClass('hidden');
        }
      });
    }
  }
})

var makeCall = function(remoteUsername) {
  Session.set('callmate', remoteUsername);
  console.log('Calling ' + remoteUsername);
  webrtcCall.call(remoteUsername, function(result) {
    if (result.error) {
      console.log(result.error);
    } else {
      callingCallState();
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
      callingCallState();
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

var credentialCheck = function(sender) {
  if (Session.get("callmate") !== sender
    || callState.status !== "calling") {
    throw "Unable to perform operation";
  }
}

// Disable video 
Meteor.ClientCall.methods({
  hideVideo : function(sender) {
    credentialCheck(sender);
    $('#remoteVideoStub').removeClass('hidden').height($('video#remoteVideo').height());
    $('video#remoteVideo').addClass('hidden');
    $('#videoCenterInfo').removeClass('hidden');
  },
  displayVideo : function(sender) {
    credentialCheck(sender);
    $('#remoteVideoStub').addClass('hidden');
    $('video#remoteVideo').removeClass('hidden');
    $('#videoCenterInfo').addClass('hidden');
  },
  mute : function(sender) {
    credentialCheck(sender);
    document.getElementById('remoteVideo').muted = true;
  }, 
  unmute : function(sender) {
    credentialCheck(sender);
     document.getElementById('remoteVideo').muted = false;
  }
});

