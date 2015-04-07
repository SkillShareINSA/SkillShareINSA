Meteor.startup(function () {
    if (SkillList.find().count() === 0) {
        var data = [
            {
                name: "Ada 1ère année",
                teachers: [
                    'Toto',
                    'Pascal'
                ]
            },
            {
                name: "Maths 2",
                teachers: [
                    'Pascal',
                    'Paul'
                ]
            },
            {
                name: "PPI 3"
            }
        ];
        var i;
        for (i = 0; i < data.length; i++) {
            SkillList.insert(data[i]);
        }
    }
});

if (Meteor.isServer) {
    Meteor.methods({
        'logIn' : function(input) {
            console.log("SERVER : HELLO");
        }
    });
}