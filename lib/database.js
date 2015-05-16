SkillList = new Meteor.Collection('SkillList');
ChatMessages = new Meteor.Collection('ChatMessages');

if (Meteor.isServer) {
  Meteor.publish('skillList', function() {
      return SkillList.find({});
    }
  );

  Meteor.publish('chatSession', function() {
    if (this.userId != null) {
      return ChatMessages.find({ $or: [
        {sender_id: this.userId},
        {receiver_id: this.userId}
      ]});
    }
    else
      return null;
  });

  Meteor.publish('usersStatus', function() {
    return Meteor.users.find({fields: {"status.online" : 1, emails : 1, username : 1}});
  });

  ChatMessages.allow({
    insert : function(userId, doc) {
      return userId != null;
    }
  })

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
    Meteor.subscribe('usersStatus', function() {
      Session.set('users_loaded', true);
    });
  });
  Meteor.subscribe('skillList');
}