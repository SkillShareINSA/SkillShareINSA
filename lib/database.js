SkillList = new Meteor.Collection('SkillList');

Messages = new Mongo.Collection("messages");



if (Meteor.isServer) {



 Meteor.methods({
    insertMessage: function (message) {
      Messages.insert(message);
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
      return{};
    }
  );



  Meteor.publish('usersStatus', function() {
    return Meteor.users.find({}, {fields: {"status.online" : 1, emails : 1, username : 1}});
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