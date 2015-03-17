Router.configure({
    layoutTemplate : 'mainLayout'
});
Router.route('/', function () {
  this.render('defaultPage');
});
Router.route('/courses', function () {
  this.render('courseList');
});
Router.route('/call', function() {
  this.render('videoCall');
})