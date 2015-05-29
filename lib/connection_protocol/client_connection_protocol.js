if (Meteor.isClient) {

	Template.claimConnection.helpers({
        'checkConnectionOnServer': function(crypt) {
            Meteor.call('getLoginInfos',Router.current().params.query.input, function(error,result) {
                if (error) throw (error);
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

    Template.sidebar.events({
        'click #btn_logout_debbug' : function() {
            Meteor.logout();
            console.log("LOGGED OUT DEBBUG USER");
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}