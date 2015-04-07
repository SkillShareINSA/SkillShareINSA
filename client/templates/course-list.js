Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});


    Meteor.methods({
        'logIn' : function(input) {
            console.log("SERVER : HELLO");
        }
    });

Template.loggingIn.helpers({
    'start' : function() {
    
        function extractUrlParams(){
            var t = location.search.substring(1).split('&');
            var f = [];
            for (var i=0; i<t.length; i++){
                var x = t[ i ].split('=');
                f[x[0]]=x[1];
            }
            return f;
        }

        Meteor.call('logIn');
    }
});


Template.courseList.helpers({
    skillList : function() {
        return SkillList.find();
    }
});

Template.courseList.events({
    'click .removeBtn' : function(event) {
        var skillName = $(event.target).parent().text();
        // TODO : replace with publish/subscribe mechanism
        var skillId = SkillList.findOne({name : skillName})._id;
        SkillList.remove(skillId);
    },
    'click #modal-addCourseBtn' : function(event) {
        var skillName = $('#modal-skillNameInput').val();
        SkillList.insert({name : skillName});
        $('#myModal').modal('hide');
    }
});

//if (Meteor.isClient) {
    Template.seekHelp.helpers({
        'skillList' : function() {
            return SkillList.find();
        },

        'getTeachersOf' : function(skillName) {
            if (Meteor.isClient)
                console.log("Je suis client");
            else
                console.log("Je suis serveur");
            console.log("SKILLNAME: "+skillName);
            var skill = SkillList.findOne({name : skillName});
            console.log(skill.teachers);
            return skill.teachers;
        }
    });
//}


