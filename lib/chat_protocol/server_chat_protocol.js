if (Meteor.isServer) {
	Meteor.methods({
		post_message: function(message,receiver) {
			console.log("post_message called");
			ChatMessages.insert({
				receiver : receiver,
				content : message
			});
		},

		get_messages: function(receiver) {
			console.log("get_messages called");
			var messages = ChatMessages.find({receiver : receiver}).fetch();
			ChatMessages.remove({receiver : receiver});
			return messages;
		}
	});
}
