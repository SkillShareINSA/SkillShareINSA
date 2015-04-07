Router.configure({
    layoutTemplate : 'mainLayout'
});
Router.route('/', function () {
    this.render("defaultPage");
});
Router.route('/courses', function () {
   this.render("courseList");
});
Router.route('/help', function () {
   this.render("seekHelp");
});
Router.route('/loggingIn', function () {
   this.render("loggingIn");
});