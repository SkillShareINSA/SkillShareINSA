SkillList = new Meteor.Collection('SkillList');

Messages = new Meteor.Collection("messages");



if (Meteor.isServer) {


  Accounts.onCreateUser(function(options, user){

    user.nb_unread_messages = 0;
    console.log("Insertion champ nb_unread_messages");
    if(options.profile){
      user.profile = options.profile;
    }
    return user;
  });

 Meteor.methods({
    insertMessage: function (message) {
      //vérification des données envoyé par l'utilisateur
      var local_user =  Meteor.users.find({username : message.from}).fetch()[0];
      var distant_user = Meteor.users.find({username : message.to}).fetch()[0];
      //console.log("Debug insertMessage => this.userId  : " + this.userId + "local user Id : " + local_user._id + " distant_user typeof : " + (typeof distant_user));
      console.log("Distant user : " + distant_user.username + " Local user : " + local_user.username);
      //envoi du message 
      if((local_user._id==this.userId) && (typeof distant_user != undefined)){
        Messages.insert(message);
        Meteor.users.update(distant_user._id, {$set: {nb_unread_messages : distant_user.nb_unread_messages + 1}});
        }
      else{
        console.log("Essai frauduleux d'insertion");
      }

    },

    /*
    incrementUser: function(JSON){
      Meteor.users.update(JSON.distant_user._id, {$set: {nb_unread_messages : JSON.distant_user.nb_unread_messages + 1}});
    },
    */

    resetUser: function(JSON){
      console.log("fonction reset");
      Meteor.users.update(this.userId, {$set: {nb_unread_messages : 0}});
    }
  });




  Meteor.publish('skillList', function() {
      return SkillList.find({});
    }
  );


  Meteor.publish("messages", function () {
    if (this.userId != null) {
      var user = Meteor.users.find({_id : this.userId}).fetch()[0];
      console.log(this.userId);


      return Messages.find({
        $or: [
          { to: user.username },
          { from: user.username }
        ]
        });

      }
    else
      return [];
    }
  );



  Meteor.publish('usersStatus', function() {
    return Meteor.users.find({}, {fields: {"status.online" : 1, emails : 1, username : 1, nb_unread_messages : 1}});
  });


  SkillList.allow({
    insert : function(userId, doc) {
      return userId != null;
    },
    remove : function(userId, doc) {
      return userId != null;
    }
  })
} else if (Meteor.isClient) {
  Meteor.startup(function() {
    Session.set('users_loaded', false); 
  });
  Deps.autorun(function() {
    Meteor.subscribe("messages");
    Meteor.subscribe('usersStatus', function() {
      Session.set('users_loaded', true);
    });
  });
  Meteor.subscribe('skillList');

}