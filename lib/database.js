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
      console.log("Debut insertion");
      Messages.insert(message);
    },
    incrementUser: function(JSON){
      Meteor.users.update(JSON.distant_user._id, {$set: {nb_unread_messages : JSON.distant_user.nb_unread_messages + 1}});
    },

    resetUser: function(JSON){
      console.log("fonction reset");
      Meteor.users.update(JSON.userId, {$set: {nb_unread_messages : 0}});
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