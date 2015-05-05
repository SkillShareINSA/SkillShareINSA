if (Meteor.isServer) {
    Meteor.methods({
        isConnected : function(name_user) {
            
        }
    });
}




Template.defaultPage.events({
    // 'start' : function() {
    //     Meteor.call('login_requested',"jauffret");
    // },

    'click #connect' : function(event) {
        var url = "localhost/callCAS/index.php";
        console.log("before");
        HTTP.get(url, function (error, result) {});
        console.log("after");
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

Template.postConnect.onCreated = function() {
    Accounts.callLoginMethod({
        methodArguments: [{username: Router.current().params.query.user}]
    });
    //Meteor.call('login_requested',Router.current().params.query.user);
    Router.go('courses');
};

Template.logout.logout = function() {
    Meteor.logout();
    Meteor.call('logout_requested',Router.current().params.query.user);
    Router.go('/');
};