

  Template.inbox.helpers({
      messages : function() {
      return Messages.find({}, {sort: { to: 1 }});        
    },

      messagesReceived : function() {
        Console.log("messagesReceived : Id non nul");
        if(Meteor.userId() != null){
          var user = Meteor.users.find({_id : Meteor.userId()}).fetch()[0]
          //Console.log(user);
          return Messages.find({to : user.username }, {sort: { datesort: -1 }});
          }
        else
          Console.log("messageReceived : Id nul");
          return [];
      },

      messagesSent : function() {
        if(Meteor.userId() != null){
          Console.log("messageSent : Id non nul");
          var user = Meteor.users.find({_id : Meteor.userId()}).fetch()[0]
          //Console.log(user);
          return Messages.find({from : user.username }, {sort: { datesort: -1 }});
          }
        else
          Console.log("messageSent :Id nul");
          return [];    
      }


  });

  Template.addMessageForm.events({

      "submit .messageForm": function (event) {
        // This function is called when the new task form is submitted
        Console.log("Entrée dans la fonction de submit");
        var to = event.target.to.value; 
        var textMessage = event.target.textMessage.value;
        var from = Meteor.user().username;
        console.log("To : "+to+" Message : "+textMessage+" from : "+from);
        var dateObject = new Date();
        //var date = dateObject.getDate()+"/"+(dateObject.getMonth() + 1) + "/" + dateObject.getFullYear() + " " + dateObject.getHours() + ":" + dateObject.getMinutes() + ":" + dateObject.getSeconds();
        var date =  dateObject.toUTCString();
        var milli = dateObect.parse();
        Console.log("Avant appel methode insertion");
        Meteor.call("insertMessage",{
          to: to,
          from : from,
          textMessage : textMessage,
          date : date,
          datesort : milli 
          });


        Console.log("Après appel methode insertion");


        //console.log("Appel a la bdd messages" + Messages.find({}).fetch());

      }
    });




