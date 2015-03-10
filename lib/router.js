Router.configure({
    layoutTemplate : 'mainLayout'
});
Router.route('/', function () {
    this.render("defaultPage");
});
Router.route('/courses', function () {
   this.render("course-list");
});