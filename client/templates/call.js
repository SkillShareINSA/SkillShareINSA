var localVideo =  $('#localVideo');
var remoteVideo = $('#remoteVideo');
var isInitiator;
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
// Opera --> getUserMedia
// Chrome --> webkitGetUserMedia
// Firefox --> mozGetUserMedia
navigator.getUserMedia = navigator.getUserMedia ||
navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
Template.videoCall.events({
  'click #callBtn' : function(event) {
      // TODO : add a createConnectionRequest step before letting user make call
      isInitiator = true;
      navigator.getUserMedia(constraints, getUserMediaHandler, getUserMediaErrorHandler);
      console.log('getUserMedia succeded with constraints', constraints);
      if (!isStarted && typeof localStream != 'undefined' && isChannelReady) {
        createPeerConnection();
        isStarted = true;
        if (isInitiator) {
          doCall();
        }
      }
      Meteor.call('initiateCall', 'hoa', 'mai',
        function(error, result) {
          console.log(result);
        });
  },
  'click #hangupBtn' : function(event) {
      Meteor.call('terminateCall', 'hoa', 'mai',
        function(error, result) {
          console.log(result);
        });
  }
});
// getUserMedia() handlers...
function getUserMediaHandler(stream) {
  localStream = stream;
  attachMediaStream(localVideo, stream);
  console.log('Adding local stream.');
  sendMessage('got user media');
}
function getUserMediaErrorHandler(error){
  console.log('navigator.getUserMedia error: ', error);
}
// Channel negotiation trigger function
function checkAndStart() {

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
  console.log('Sending message: ', message);
  Meteor.call('sendMessage', 'hoa', 'mai', message,
    function(error, result) {
      console.log(result);
    });
}

// Remote stream handlers...
function handleRemoteStreamAdded(event) {
  console.log('Remote stream added.');
  attachMediaStream(remoteVideo, event.stream);
  console.log('Remote stream attached!!.');
  remoteStream = event.stream;
}
function handleRemoteStreamRemoved(event) {
  console.log('Remote stream removed. Event: ', event);
}
window.onbeforeunload = function(e){
  hangup();
}
var isChannelReady = false;
var isStarted = false;

// Handle 'join' message coming back from server:
// another peer is joining the channel
socket.on('join', function (room){
  console.log('Another peer made a request to join room ' + room);
  console.log('This peer is the initiator of room ' + room + '!');
  isChannelReady = true;
});
// Handle 'joined' message coming back from server:
// this is the second peer joining the channel
socket.on('joined', function (room){
  console.log('This peer has joined room ' + room);
  isChannelReady = true;
// Call getUserMedia()
  navigator.getUserMedia(constraints, getUserMediaHandler, getUserMediaErrorHandler);
  console.log('Getting user media with constraints', constraints);
});
// Server-sent log message...
socket.on('log', function (array){
  console.log.apply(console, array);
});
// Receive message from the other peer via the signaling server
socket.on('message', function (message){
  console.log('Received message:', message);
  if (message === 'got user media') {
    checkAndStart();
  } else if (message.type === 'offer') {
    if (!isInitiator && !isStarted) {
      checkAndStart();
    }
    pc.setRemoteDescription(new RTCSessionDescription(message));
    doAnswer();
  } else if (message.type === 'answer' && isStarted) {
    pc.setRemoteDescription(new RTCSessionDescription(message));
  } else if (message.type === 'candidate' && isStarted) {
    var candidate = new RTCIceCandidate({sdpMLineIndex:message.label,
      candidate:message.candidate});
    pc.addIceCandidate(candidate);
  } else if (message === 'bye' && isStarted) {
    handleRemoteHangup();
  }
});
// Data channel management
function sendData() {
  var data = sendTextarea.value;
  if(isInitiator) sendChannel.send(data);
  else receiveChannel.send(data);
  trace('Sent data: ' + data);
}

// Create Offer
function doCall() {
  console.log('Creating Offer...');
  pc.createOffer(setLocalAndSendMessage, onSignalingError, sdpConstraints);
}
// Signaling error handler
function onSignalingError(error) {
  console.log('Failed to create signaling message : ' + error.name);
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
  if (sendChannel) sendChannel.close();
  if (receiveChannel) receiveChannel.close();
  if (pc) pc.close();
  pc = null;
  sendButton.disabled=true;
}