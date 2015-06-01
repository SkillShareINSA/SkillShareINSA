function WebRTCCall () {

  Deps.autorun(function() {
    console.log(Meteor.userId());
    Meteor.ClientCall.setClientId(Meteor.userId());
  });

  var pc_config =
    webrtcDetectedBrowser === 'firefox' ?
    {'iceServers':[{'url':'stun:23.21.150.121'}]} :
    {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
  var pc_constraints = {
    'optional': [
      {'DtlsSrtpKeyAgreement': true}
    ]};
  var sdpConstraints = {};
  var constraints = {video: true, audio: true};

  var isInitiator = false;
  var isChannelReady = false;
  var isStarted = false;

  var localStream;
  var remoteStream;

  var remoteUsername;

  var pc;

  var onNewCallCallback;
  var callerGotUserMediaCallback;
  var calleeGotUserMediaCallback;
  var onCallRefusedCallback;
  var onRemoteHangupCallback;
  var onGetUserMediaErrorCallback;

  var localVideoId;
  var remoteVideoId;

  // Opera --> getUserMedia
  // Chrome --> webkitGetUserMedia
  // Firefox --> mozGetUserMedia
  navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  this.call = function(username, callback) {

    var cb = function (error, result) {
      if (!error) {
        console.log(result);
        isChannelReady = true;
      } else {
        console.log(error.error);
      }
    };

    isInitiator = true;
    if (!Meteor.users.findOne({username : username})) {
      // invalid username
      callback({error : "Utilisateur non trouvé"});
    } else if (username == Meteor.user().username) {
       callback({error : "Impossible d'appeler soi-même"});
    } else {
      remoteUsername = username;
      Meteor.call('initiateCall', Meteor.user().username, username, cb);
      callback({});
    }
  };

  this.onCall= function(callback) {
    onNewCallCallback = callback;
  };

  this.acceptCall = function(callback) {
    console.log('Accepted call');
    isChannelReady = true;
    navigator.getUserMedia(constraints, getUserMediaHandler, getUserMediaErrorHandler);
    console.log('Getting user media with constraints', constraints);
    Meteor.call('acceptCall', Session.get('caller'));
    remoteUsername = Session.get('caller');
    callback(remoteUsername);
  };

  this.refuseCall = function(callback) {
    Meteor.call('refuseCall', Session.get('caller'));
    callback(remoteUsername);
  }

  this.attachLocalVideo = function(id) {
    localVideoId = id;
  };

  this.attachRemoteVideo = function(id) {
    remoteVideoId = id;
  };

  this.hangup = function(callback) {
    hangup(callback);
  };

 this.callerGotUserMedia = function(callback) {
    callerGotUserMediaCallback = callback;
  };

  this.calleeGotUserMedia = function(callback) {
    calleeGotUserMediaCallback = callback;
  };

  this.onCallRefused = function(callback) {
    onCallRefusedCallback = callback;
  };

  this.onGetUserMediaError = function (callback) {
    onGetUserMediaErrorCallback = callback;
  }

  this.onRemoteHangup = function(callback) {
    onRemoteHangupCallback = callback;
  };

  Meteor.ClientCall.methods({
    callRequested : function(caller) {
      Session.set('caller', caller);
      console.log('Received callRequest : ' + caller +            ' want to call. Accept ?');
      onNewCallCallback(caller);
    },

    callAccepted : function(caller) {
      console.log('Nice to call with ya ' + caller);
    },

    callRefused : function(caller) {
      console.log("Call refused");
      onCallRefusedCallback();
    },

    log : function (array){
      console.log.apply(console, array);
    },

    message : function (message){

      if (message === 'got user media') {
        console.log('Received message:', message);
        if (isInitiator) {
          navigator.getUserMedia(constraints, function(stream) {
            getUserMediaHandler(stream);
            callerGotUserMediaCallback();
          }, getUserMediaErrorHandler);
        } else {
          calleeGotUserMediaCallback();
        }
        checkAndStart();
      } else if (message.type === 'offer') {
        console.log('Received message : offer');
        checkAndStart();
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
        handleRemoteHangup();
      }
    }
  });

  window.onbeforeunload = function(e){
    if (isStarted)
      hangup();
  };

  // getUserMedia() handlers...
  function getUserMediaHandler(stream) {
    console.log('getUserMedia succeded with constraints', constraints);
    localStream = stream;
    var localVideo = document.querySelector('#' + localVideoId);
    attachMediaStream(localVideo, stream);
    console.log('Adding local stream.');
    sendMessage('got user media');
  }
  function getUserMediaErrorHandler(error){
    console.log('navigator.getUserMedia error: ', error);
    Meteor.call('refuseCall', Session.get('caller'));
    onGetUserMediaErrorCallback();
  }
  // Channel negotiation trigger function
  function checkAndStart() {
    if (!isStarted && typeof localStream != 'undefined' && isChannelReady) {
      console.log("I'm here !!!");
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
  function handleIceCandidate(event){
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
  function hangup(callback) {
    console.log('Hanging up.');
    Meteor.call('terminateCall', Meteor.user().username, remoteUsername, callback ? callback : null);
    stop();
  }
  function handleRemoteHangup() {
    console.log('Session terminated.');
    stop();
    onRemoteHangupCallback();
    isInitiator = false;
  }
  function stop() {
    isStarted = false;
    if (pc) pc.close();
    pc = null;
  }
}