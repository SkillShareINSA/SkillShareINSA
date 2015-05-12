Accounts.validateLoginAttempt(function(arg) {
  if (typeof arg.user != 'undefined') {
    /* reset the password to a random value */
    Accounts.setPassword(arg.user._id,getRandomString(15));
    return arg.allowed;
  }
});

function getRandomString(size) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < size; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var httpGetAsync = function (login, password,cb) {
  var url = "http://localhost/callCAS/is_connected.php";
  HTTP.get(url, {params: {'login': login, 'password' : password}}, function (error, result) {
    if (!error) {
      console.log("result = "+ result.content);
      if (result.content == 1) {
        cb && cb(null,true);
      }
      else {
        cb && cb(null,false);
      }
    }
    else {
      cb && cb(null,false);
    }
  });
};

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
    Meteor.ClientCall.apply(calleeRecord._id, 'callRequest', [caller]);
    return 'Server : Call initiated successfully !';
  },

  // forward acceptCall request to client
  acceptCall : function(caller) {
    var callerRecord = Meteor.users.findOne({username : caller});
    Meteor.ClientCall.apply(callerRecord._id, 'acceptCall');
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

  logout_requested : function (user_name) {
      var url = "http://localhost/callCAS/disconnect.php";

      console.log(url);

      HTTP.get(url, {params: {user: user_name}});
  },

  getLoginInfos : function(crypt_with_spaces) {

    function turnSpacesIntoPlus(string_with_spaces) {
      return string_with_spaces.replace(new RegExp(' ', 'g'),'+');
    }

    function decryptInput(crypt) {
      var key = CryptoJS.enc.Base64.parse("YTViNTY5NmEzOGJlMDdkM2JkODdhODE3ODY3ZDRjNjM="); 
      var iv = CryptoJS.enc.Base64.parse("YTViNTY5NmEzOGJlMDdkMw==");

      var encrypt = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(crypt),
      });

      return CryptoJS.AES.decrypt(encrypt,key,{'iv':iv}).toString(CryptoJS.enc.Utf8);
    }

    function checkSum(decrypt) {
      var checkSum;
      var identifications = {
        'login' : "",
         'password' : ""
      };

      if (typeof decrypt != 'undefined' && decrypt.length > 21) {
        /*extraction du password */
        identifications.password = decrypt.substring(0,10);
        /*extraction de checkSum */
        checkSum = decrypt.substring(10,20);
        /*contrôle du checkSum */
        if (checkSum == "£Cf1Asv( %") {
          /*extraction du login avec un espace en fin sorti de nulle part...*/
          identifications.login = (decrypt.substring(20));
          /*on retire l'espace sorti de nulle part...*/
          identifications.login = identifications.login.substring(0,identifications.login.length-3);
        }
        /*checSum incorrect */
        else {
          /*remise à zero du password */
          identifications.password = "";
        }
      }

      return identifications;
    }

    var crypt = turnSpacesIntoPlus(crypt_with_spaces);
    var decrypt = decryptInput(crypt);
    var identifications = checkSum(decrypt);
    var connection_confirmed;

    var httpGetSync = Meteor.wrapAsync(httpGetAsync);

    console.log("fonction getLogingInfos called with "+crypt);
    console.log("decrypt = "+decrypt);
    console.log("login = "+identifications.login+"&&");
    console.log("password = "+identifications.password);

    var connection_confirmed = httpGetSync(identifications.login,identifications.password);
    if (connection_confirmed) {
      var login = identifications.login;
      var password = identifications.password;
      console.log("Confirmed connection by PHP server"); 
      /*si l'utilisateur n'existe pas */
      if (Meteor.users.find({username: login}).fetch().length == 0) {
        /* on creer le nouvel utilisateur avec le mot de passe fourni par le serveur PHP*/
        Accounts.createUser({username:login,password:password});
      }
      /*l'utilisateur existe déjà */
      else {
        /* on écrase le précédent mot de passe à usage unique par le nouveau fourni par le server PHP */
        Accounts.setPassword(Meteor.users.find({username: login}).fetch()[0]._id,password);
      }

      return identifications;
    }
    /* Echec de la validation de la connexion */
    else {
      console.log("connection denied by the PHP server"); 

      identifications.login = "";
      identifications.password = "";
      return identifications;
    }
  }

});