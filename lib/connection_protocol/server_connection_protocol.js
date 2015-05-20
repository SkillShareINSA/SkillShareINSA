if (Meteor.isServer) {

	/*****************************************************/
	/******DEBBUG PURPOSE ONLY, DELETE BEFORE DEPLOY******/
	/******ALSO REMOVE PACKAGE ACCOUNTS-UI****************/
	/*****************************************************/

	Accounts.onCreateUser(function(options, user) {
	  	
	 	if (user.username.indexOf("user_test") > -1) {
	 		user.debbug = true;
	 	}
	  	// We still want the default hook's 'profile' behavior.
	  	if (options.profile)
	    	user.profile = options.profile;
	  	return user;
	});

	/************************************************************/
	/*************CONSERVE FOLLOWING CODE FOR DEPLOY*************/
	/************************************************************/

	var httpGetAsync = function (login, password,cb) {
		var url = "http://localhost/callCAS/is_connected.php";
		console.log("httpGet: $$"+login+"$$ "+" $$"+password+"$$");
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
				console.log("error on httpGet");
				cb && cb(null,false);
			}
		});
	};

	/**
	 *  Remote functions that could be invoked by Meteor clients
	 */

	Meteor.methods({
	 	getLoginInfos : function(crypt_with_spaces) {

	 		function turnSpacesIntoPlus(string_with_spaces) {
	 			return string_with_spaces.replace(new RegExp(' ', 'g'),'+');
	 		}

	 		function removeNullChar(str_in) {
	 			var compteur = 0;
	 			for (i = 0; i < str_in.length;i++) {
	 				if (str_in.charCodeAt(i) == 0) {
	 					compteur++;
	 				}
	 			}
	 			return str_in.substring(0,str_in.length-compteur);
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
	 					/*extraction du login avec des espaces en fin sortis de nulle part...*/
	 					identifications.login = decrypt.substring(20);
	 					/*on retire les espaces sortis de nulle part...*/
	 					identifications.login = removeNullChar(identifications.login);
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
	 		console.log("login = "+identifications.login);
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

}