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
  if (Meteor.users.find().count() === 0) {
      var data = [
        {
          username : 'an',
          password : '123'
        },
        {
          username : 'chao',
          password : '456'
        }
      ];
      var i;
      for (i = 0; i < data.length; i++) {
        Accounts.createUser(data[i], null);
      }
  }
});
/*
Meteor.methods({
  foo : function (arg) {
    console.log("What is arg ? " + arg);
    check(arg, Number);
    if (arg == 1) {
      return 42;
    }
    return "You suck";
  }
});
*/
