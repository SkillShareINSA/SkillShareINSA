Template.userList.helpers({
  userList : function() {
    return Meteor.users.find().fetch();
  },
  isCurrentUser : function(username) {
    return Meteor.user().username == username;
  }
});