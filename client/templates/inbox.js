
  Template.inbox.helpers({
      message : function() {
          return Messages.find();
      }
  });

  Template.inbox.events({

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


        Messages.insert({
          to: to,
          from : from,
          textMessage : textMessage
        });

        console.log("Appel a la bdd messages" + Messages.find({}).fetch().toString())

      }
    });




