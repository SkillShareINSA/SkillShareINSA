Router.configure({
    layoutTemplate : 'mainLayout'
});

Router.route('/', function () {
  this.render('defaultPage');
});

Router.route('/courses', function () {
  this.render('courseList');
});

Router.route('/chat_test', function () {
  Meteor.subscribe("chatSession");
  this.render('chat_test');
});

Router.onBeforeAction(
  function() {
    if (!Meteor.userId()) {
      this.render('defaultPage');
    } else {
      this.next();
    }
  },
  {only : ['call', 'courses','help','chat_test']}
);

Router.route('/call', function() {
    this.render('videoCall');
});

Router.route('/help', function () {
   this.render("seekHelp");
});

Router.route('/claimConnection', function () {
   this.render("claimConnection");
  }
);

