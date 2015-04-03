SkillList = new Meteor.Collection('SkillList');
if (Meteor.isServer) {
  Meteor.publish('skillList', function() {
      return SkillList.find({});
    }
  );
  SkillList.allow({
    insert : function(userId, doc) {
      return userId != null;
    },
    remove : function(userId, doc) {
      return userId != null;
    }
  })
} else if (Meteor.isClient) {
  Meteor.subscribe('skillList');
}