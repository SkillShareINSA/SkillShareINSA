SkillList = new Meteor.Collection('SkillList');
if (Meteor.isServer) {
  Meteor.publish('skillList', function() {
      return SkillList.find({});
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
  Deps.autorun(function() {
    Meteor.subscribe('usersStatus');
  });
  Meteor.subscribe('skillList');
}