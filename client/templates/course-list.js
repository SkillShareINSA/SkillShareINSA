Template.defaultPage.events({

    'click #connect' : function(event) {
        var url = "localhost/callCAS/index.php";
        console.log("before");
        HTTP.get(url, function (error, result) {});
        console.log("after");
    },
    'click #test' : function(event) {
        Meteor.call('decrypt');
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

    Template.claimConnection.helpers({
        'checkConnectionOnServer': function(crypt) {
            Meteor.call('getLoginInfos',Router.current().params.query.input, function(error,result) {
                var identifiants = result;
                /* Si l'utilisateur est vraiment connecté au serveur CAS et PHP */
                if (identifiants.login != "" && identifiants.password != "") {
                    /* On connecte l'utilisateur */
                    Meteor.loginWithPassword(identifiants.login,identifiants.password);
                }
                else {
                    console.log("Te fous pas de ma guele, je sais que t'es pas connecté !");
                }
                Router.go('/courses');
            });
            
        }
    });

Template.logout.logout = function() {
    Meteor.logout();
    Meteor.call('logout_requested',Router.current().params.query.user);
    Router.go('/');
};