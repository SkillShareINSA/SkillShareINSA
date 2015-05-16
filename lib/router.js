Router.configure({
    layoutTemplate : 'mainLayout'
});

Router.route('/', function () {
  this.render('defaultPage');
});
Router.route('/courses', function () {
  this.render('courseList');
});
Router.onBeforeAction(function() {
  if (!Meteor.userId()) {
    this.render('connect');
  } else {
    this.next();
  }
}, {only : ['call', 'courses','inbox']});
Router.route('/call', function() {
  this.render('videoCall');
});

Router.route('/call/:userId', function() {
  this.render('videoCall', {data : {userId : this.params.userId}});
});

Router.route('/help', function () {
   this.render("seekHelp");
});

Router.route('/postConnect', function () {
   this.render("postConnect");
});

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

