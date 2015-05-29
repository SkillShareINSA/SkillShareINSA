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
    'click #addCourseBtn' : function(event) {
        $('#addCoursePopup').modal('show').css("z-index", "1500");
    },
    'click .removeBtn' : function(event) {
        var skillName = $(event.target).parent().text();
        // TODO : replace with publish/subscribe mechanism
        var skillId = SkillList.findOne({name : skillName})._id;
        SkillList.remove(skillId);
        return false;
    },
    'click #courseListTable td' : function(event) {
        $(event.target).parent().next('.hidden-info').toggle();
    }
});

Template.addCoursePopup.events({
    'click #confirmButton' : function() {
        var skillName = $('#modal-skillNameInput').val();
        SkillList.insert({name : skillName});
        $('#addCoursePopup').modal('hide');
    }
});

Template.logout.logout = function() {
    Meteor.logout();
    Meteor.call('logout_requested',Router.current().params.query.user);
    Router.go('/');
};