Template.videoCall.onCreated(function() {
    Meteor.ClientCall.setClientId(Meteor.userId());
});
var isInitiator = false;
var isChannelReady = false;
var isStarted = false;
// WebRTC data structures
// Streams
var localStream;
var remoteStream;
// PeerConnection
var pc;
// PeerConnection ICE protocol configuration (either Firefox or Chrome)
var pc_config = webrtcDetectedBrowser === 'firefox' ?
{'iceServers':[{'url':'stun:23.21.150.121'}]} : // IP address
{'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
var pc_constraints = {
  'optional': [
    {'DtlsSrtpKeyAgreement': true}
  ]};
var sdpConstraints = {};
var constraints = {video: true, audio: true};
var remoteUsername;
// Opera --> getUserMedia
// Chrome --> webkitGetUserMedia
// Firefox --> mozGetUserMedia
navigator.getUserMedia = navigator.getUserMedia ||
navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
Template.videoCall.events({
  'click #callBtn' : function(event) {
      console.log('User id ' + Meteor.user().username);
      isInitiator = true;
      remoteUsername = Meteor.user().username == 'an' ? 'chao' : 'an';
      Meteor.call('initiateCall', Meteor.user().username, remoteUsername,
        function(error, result) {
          if (!error) {
            console.log(result);
            navigator.getUserMedia(constraints, getUserMediaHandler, getUserMediaErrorHandler);
            isChannelReady = true;
          } else {
            console.log(error.error);
          }
        });
  },
  'click #hangupBtn' : function(event) {
      Meteor.call('terminateCall', Meteor.user().username, remoteUsername,
        function(error, result) {
          console.log('Hung up call with ' + remoteUsername);
          stop();
        });
  }
});


/**
 * Remote functions that could be invoked by Meteor server
 */
Meteor.ClientCall.methods({
  callRequest : function(caller) {
    console.log('Received callRequest : ' + caller + ' want to call. Accept ?');
    isChannelReady = true;
    navigator.getUserMedia(constraints, getUserMediaHandler, getUserMediaErrorHandler);
    console.log('Getting user media with constraints', constraints);
    Meteor.call('acceptCall', caller);
    remoteUsername = caller;
  },

  log : function (array){
    console.log.apply(console, array);
  },
  message : function (message){

    if (message === 'got user media') {
      console.log('Received message:', message);
      checkAndStart();
    } else if (message.type === 'offer') {
      console.log('Received message : offer');
      if (!isInitiator && !isStarted) {
        checkAndStart();
      }
      pc.setRemoteDescription(new RTCSessionDescription(message));
      doAnswer();
    } else if (message.type === 'answer' && isStarted) {
      console.log('Received message : answer');
      pc.setRemoteDescription(new RTCSessionDescription(message));
    } else if (message.type === 'candidate' && isStarted) {
      console.log('Received message : candidate');
      var candidate = new RTCIceCandidate({sdpMLineIndex:message.label,
        candidate:message.candidate});
      pc.addIceCandidate(candidate);
    } else if (message === 'bye' && isStarted) {
      if (!Meteor.userId() || Meteor.userId() != receiverId) {
        return;
      }
      handleRemoteHangup();
    }
  }
});

// getUserMedia() handlers...
function getUserMediaHandler(stream) {
  console.log('getUserMedia succeded with constraints', constraints);
  localStream = stream;
  var localVideo = document.querySelector('#localVideo');
  attachMediaStream(localVideo, stream);
  console.log('Adding local stream.');
  sendMessage('got user media');
}
function getUserMediaErrorHandler(error){
  console.log('navigator.getUserMedia error: ', error);
}
// Channel negotiation trigger function
function checkAndStart() {
  if (!isStarted && typeof localStream != 'undefined' && isChannelReady) {
    createPeerConnection();
    isStarted = true;
    doCall();
  }
}
// PeerConnection management...
function createPeerConnection() {
  try {
    pc = new RTCPeerConnection(pc_config, pc_constraints);
    pc.addStream(localStream);
    pc.onicecandidate = handleIceCandidate;
    console.log('Created RTCPeerConnnection with:\n' +
    ' config: \'' + JSON.stringify(pc_config) + '\';\n' +
    ' constraints: \'' + JSON.stringify(pc_constraints) + '\'.');
  } catch (e) {
    console.log('Failed to create PeerConnection, exception: ' + e.message);
    alert('Cannot create RTCPeerConnection object.');
    return;
  }
  pc.onaddstream = handleRemoteStreamAdded;
  pc.onremovestream = handleRemoteStreamRemoved;
}
// ICE candidates management
function handleIceCandidate(event) {
  console.log('handleIceCandidate event: ', event);
  if (event.candidate) {
    sendMessage({
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate});
  } else {
    console.log('End of candidates.');
  }
}
// 2. Client-->Server
// Send message to the other peer via the signaling server
function sendMessage(message){
  console.log('Sending message: ');
  Meteor.call('sendMessage', Meteor.user().username, remoteUsername, message,
    function(error, result) {
      console.log(result);
    });
}

// Remote stream handlers...
function handleRemoteStreamAdded(event) {
  console.log('Remote stream added.');
  var remoteVideo = document.querySelector('#remoteVideo');
  attachMediaStream(remoteVideo, event.stream);
  console.log('Remote stream attached!!.');
  remoteStream = event.stream;
}
function handleRemoteStreamRemoved(event) {
  console.log('Remote stream removed. Event: ', event);
}
window.onbeforeunload = function(e){
  if (isStarted)
    hangup();
}


// Create Offer
function doCall() {
  console.log('Creating Offer...');
  pc.createOffer(setLocalAndSendMessage, onSignalingError, sdpConstraints);
}
// Signaling error handler
function onSignalingError(error) {
  console.log('Failed to create signaling message : ' + error);
}
// Create Answer
function doAnswer() {
  console.log('Sending answer to peer.');
  pc.createAnswer(setLocalAndSendMessage, onSignalingError, sdpConstraints);
}
// Success handler for both createOffer()
// and createAnswer()
function setLocalAndSendMessage(sessionDescription) {
  pc.setLocalDescription(sessionDescription);
  sendMessage(sessionDescription);
}

// Clean-up functions...
function hangup() {
  console.log('Hanging up.');
  stop();
  sendMessage('bye');
}
function handleRemoteHangup() {
  console.log('Session terminated.');
  stop();
  isInitiator = false;
}
function stop() {
  isStarted = false;
  if (pc) pc.close();
  pc = null;
  $('#localVideo').attr('src', null);
}