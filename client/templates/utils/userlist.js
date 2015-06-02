Template.userList.helpers({
  userList : function() {
    return Meteor.users.find().fetch();
  },
  isCurrentUser : function(username) {
    return Meteor.user().username == username;
  }
});

Template.userList.events({
	'click i.fa-phone' : function(e) {
		Router.go('/call/' + e.target.parentNode.textContent.trim());
		// workaround to execute Template.videoCall.onRendered
		window.location.reload();
	}
});