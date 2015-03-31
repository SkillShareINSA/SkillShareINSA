Deps.autorun(function() {
  Meteor.subscribe('usersStatus');
});
Template.userList.helpers({
  userList : function() {
    return Meteor.users.find().fetch();
  }
});