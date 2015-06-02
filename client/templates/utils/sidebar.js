 Template.sidebar.helpers({
            nbUnreadMessages : function() {
            if(Meteor.userId() != null){
                console.log("On est bien rentré dans le helper");
                var nb_messages = Meteor.user().nb_unread_messages;
                if(nb_messages > 99) return "99+";
                	else return nb_messages;
            }
        
            else
            return "";
            }
        });