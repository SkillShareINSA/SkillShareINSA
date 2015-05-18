
 Template.inbox.onRendered(function() {
    console.log("RENDER DE LA PAGE");
    pseudo = Router.current().params.query.pseudo;
    console.log("Param pseudo :" + pseudo);

   if (pseudo != null) document.getElementById("to").value = pseudo;
  });


  Template.inbox.helpers({

      messages : function() {
      return Messages.find({}, {sort: { to: 1 }});        
    },

      numberMessagesReceived : function() {
      return Messages.find({to : Meteor.user().username }).count();
      },

      numberMessagesSent : function() {
      return Messages.find({from : Meteor.user().username }).count();
      },

      messagesReceived : function() {
        console.log("messagesReceived : Id non nul");
        if(Meteor.userId() != null){
          //Console.log(user);
          return Messages.find({to : Meteor.user().username }, {sort: { datesort: -1 }});
          }
        else
          console.log("messageReceived : Id nul");
          return [];
      },

      messagesSent : function() {
        if(Meteor.userId() != null){
          console.log("messageSent : Id non nul");
          //console.log(user);
          return Messages.find({from : Meteor.user().username }, {sort: { datesort: -1 }});
          }
        else
          console.log("messageSent :Id nul");
          return [];    
      }


  });






Template.addMessageForm.events({

    "click #sendBtn": function (event) {
      // This function is called when the new task form is submitted
      console.log("Entrée dans la fonction de submit");
      var to = document.getElementById('to').value; 
      var textMessage = document.getElementById('textMessage').value;
      var from = Meteor.user().username;


      document.getElementById("textMessage").value = "";
      document.getElementById("to").value = "";


      console.log("To : "+to+" Message : "+textMessage+" from : "+from);
      var dateObject = new Date();
      //var date = dateObject.getDate()+"/"+(dateObject.getMonth() + 1) + "/" + dateObject.getFullYear() + " " + dateObject.getHours() + ":" + dateObject.getMinutes() + ":" + dateObject.getSeconds();
      var date =  dateObject.toUTCString();
      var milli = dateObject.getTime();
      console.log("Avant appel methode insertion");
      Meteor.call("insertMessage",{
        to: to,
        from : from,
        textMessage : textMessage,
        date : date,
        datesort : milli 
        });


      console.log("Après appel methode insertion");
      //console.log("Appel a la bdd messages" + Messages.find({}).fetch());

    }
  });