
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

Template.inbox.events({

  "click #messReceived": function(event){
    //console.log("clic");
    Meteor.call("resetUser",{});

  }

});


Template.addMessageForm.events({

    "click #sendBtn": function (event) {

      //console.log("Entrée dans la fonction de submit");

      //recupération des informations du form
      var to = document.getElementById('to').value; 
      var textMessage = document.getElementById('textMessage').value;
      var from = Meteor.user().username;
      var dateObject = new Date();
      var date =  dateObject.toUTCString();
      var milli = dateObject.getTime(); 

      //reset du form
      document.getElementById("textMessage").value = "";
      document.getElementById("to").value = "";

      //envoi du message

      var distant_user = Meteor.users.find({username : to}).fetch()[0];
      if(typeof distant_user != "undefined"){
        console.log("Appel a la méthode insertMessage");
        Meteor.call("insertMessage",{
          to: to,
          from : from,
          textMessage : textMessage,
          date : date,
          datesort : milli 
        });
        $('#messageSentPopup').modal('show').css("z-index", "1500");
      }
      else{
        console.log("Utilisateur inexistant");
        $('#userUnknownPopup').modal('show').css("z-index", "1500");
      }
 
    }
  });

Template.userUnknownPopup.events({
  'click #confirmButton' : function() {
      $('#userUnknownPopup').modal('hide');
    }
});



Template.messageSentPopup.events({
  'click #confirmButton' : function() {
      $('#messageSentPopup').modal('hide');
    }
});