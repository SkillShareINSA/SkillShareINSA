Meteor.startup(function () {
  ChatMessages.remove({});
  
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
if (Meteor.users.find().count() === 0) {
    var data = [
      {
        username : 'an',
        password : '123'
      },
      {
        username : 'chao',
        password : '456'
      },
      {
        username : 'rprevost',
        password : '123'
      }
    ];
    var i;
    for (i = 0; i < data.length; i++) {
      Accounts.createUser(data[i], null);
    }
  }
});

if (Posts.find().count() === 0) {
    var now = new Date().getTime();


    var telescopeId = Posts.insert({
        title: 'Introducing Telescope',
        author: 'an',
        matiereName:'Ada 1ère année',
        submitted: new Date(now - 7 * 3600 * 1000)
    });

    Comments.insert({
        postId: telescopeId,
        author: 'an',
        submitted: new Date(now - 5 * 3600 * 1000),
        body: 'Interesting project Sacha, can I get involved?'
    });

    Comments.insert({
        postId: telescopeId,
        author: 'an',
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'You sure can Tom!'
    });

    Posts.insert({
        title: 'Meteor',
        matiereName:'Ada 1ère année',
        url: 'http://meteor.com',
        submitted: new Date(now - 10 * 3600 * 1000)
    });

    Posts.insert({
        title: 'The Meteor Book',
        matiereName:'Ada 1ère année',
        url: 'http://themeteorbook.com',
        submitted: new Date(now - 12 * 3600 * 1000)
    });
}

