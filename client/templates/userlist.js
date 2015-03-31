Template.userList.helpers({
  userList : function() {
    console.log(Meteor.users);
    return Meteor.users.find().fetch();
  }
});