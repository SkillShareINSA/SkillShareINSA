Meteor.startup(function () {
    if (SkillList.find().count() === 0) {
        var data = [
            {
                name: "Ada 1ère année"
            },
            {
                name: "Maths 2"
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