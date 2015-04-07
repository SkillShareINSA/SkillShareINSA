if (Meteor.isServer) {
    Meteor.methods({
        isConnected : function(name_user) {
            
        }
    });
}

Template.defaultPage.helpers({
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

        if (extractUrlParams().length != 0)  {

        }  
    }
});



Template.defaultPage.events({
    'click #connect' : function(event) {
    //     console.log("CLICKED §§§§");

    //     var xhr = new XMLHttpRequest();
    //     var file = "www.google.com";
            
    //     // xhr.ontimeout = function () {
    //     //     console.log("Timed out");
    //     //    /*TODO : do something about it*/
    //     // }


    //     xhr.onreadystatechange = function () {

    //         if (xhr.readyState == 4) {
    //             if (xhr.status >= 200 && xhr.status < 304) {
    //                 console.log("Received something and succeced");
    //             }
    //             else {
    //                 console.log("Received something and failed");
    //                 /*TODO : do something about it*/
    //             }
    //         }
    //     }

    //     xhr.open('GET', file, false);
    //     //xhr.timeout = 10000;

    //     try {
    //         console.log("xhr : "+xhr);
    //         xhr.send();
    //         console.log("after");
    //     } catch (e) {
    //         /*TODO : do something about it*/
    //     }
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
