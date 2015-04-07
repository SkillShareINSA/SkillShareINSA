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
}, {only : ['call', 'courses']});
Router.route('/call', function() {
    this.render('videoCall');
});
Router.route('/help', function () {
   this.render("seekHelp");
});
