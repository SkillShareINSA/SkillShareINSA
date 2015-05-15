if (Meteor.isClient) {
	var from_who = "";
	Template.chat_test.events({
		'click #send_btn': function(event) {
			var message = $('#text_field').val();
			var to_who = $('#to_who').val();
			$('#text_field').val("");
			Meteor.call('post_message',message,to_who);
		},
		'click #start_receive': function(event) {
			from_who =  $('#from_who').val();
		}
	});

	Template.chat_test.helpers({
		'startGetMessages': function() {
			setInterval(function() {
				if (from_who != "") {
					Meteor.call('get_messages',from_who, function(error,result) {
						var messages = result;
						for (i = 0; i < messages.length;i++) {
							console.log("message : "+messages[i].content);
						}
					});
				}
			},240);
		}
	});
}