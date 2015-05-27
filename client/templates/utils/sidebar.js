 Template.sidebar.helpers({
            nbUnreadMessages : function() {
            if(Meteor.userId() != null){
                console.log("On est bien rentré dans le helper");
                return Meteor.user().nb_unread_messages;
            }
        
            else
            return "";
            }
        });