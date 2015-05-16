

  Template.inbox.helpers({
      messages : function() {
      return Messages.find({}, {sort: { to: 1 }});        
    },

      messagesReceived : function() {
        var user = Meteor.users.find({_id : Meteor.userId()}).fetch()[0]
        return Messages.find({to : user.username });
      },

      messagesSent : function() {
        var user = Meteor.users.find({_id : Meteor.userId()}).fetch()[0]
        return Messages.find({from : user.username });
      }


  });

  Template.addMessageForm.events({

      "submit .messageForm": function (event) {
        // This function is called when the new task form is submitted
        var to = event.target.to.value; 
        var textMessage = event.target.textMessage.value;
        var from = Meteor.user().username;
        console.log("To : "+to+" Message : "+textMessage+" from : "+from);

        Meteor.call("insertMessage",{
          to: to,
          from : from,
          textMessage : textMessage});


       

        //console.log("Appel a la bdd messages" + Messages.find({}).fetch());

      }
    });




