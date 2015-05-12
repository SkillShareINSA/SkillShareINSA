if (Meteor.isClient) {

	Template.claimConnection.helpers({
        'checkConnectionOnServer': function(crypt) {
            Meteor.call('getLoginInfos',Router.current().params.query.input, function(error,result) {
                var identifiants = result;
                /* Si l'utilisateur est vraiment connecté au serveur CAS et PHP */
                if (identifiants.login != "" && identifiants.password != "") {
                    /* On connecte l'utilisateur */
                    Meteor.loginWithPassword(identifiants.login,identifiants.password);
                }
                else {
                    console.log("Te fous pas de ma guele, je sais que t'es pas connecté !");
                }
                Router.go('/courses');
            });
        }
    });

	Template.logout.logout = function() {
	    Meteor.logout();
	    Meteor.call('logout_requested',Router.current().params.query.user);
	    Router.go('/');
	};
}