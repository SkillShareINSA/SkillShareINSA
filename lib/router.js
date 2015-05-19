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
  {only : ['call', 'courses','help','chat_test', 'inbox']}
);

Router.route('/call', function() {
  Meteor.subscribe("chatSession");
  this.render('videoCall');
});

Router.route('/call/:userId', function() {
  this.render('videoCall', {data : {userId : this.params.userId}});
});

Router.route('/help', function () {
   this.render("seekHelp");
});

Router.route('/claimConnection', function () {
   this.render("claimConnection");
  }
);

Router.route('/logout', function () {
   this.render("logout");
});

Router.route('/inbox', function() {
  this.render('inbox');
});

Router.route('/inbox/test/', function() {
  console.log("Paramètre pseudo de la page : "+this.params.pseudo);
  this.render('inbox', {data : {pseudo : this.params.query.pseudo}});
});

