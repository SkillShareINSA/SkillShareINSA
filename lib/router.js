Router.configure({
    layoutTemplate : 'mainLayout'
});

Router.route('/', function () {
  this.render('defaultPage');
});
Router.route('/courses', function () {
  this.render('courseList');
});

Router.onBeforeAction(
  function() {
    if (!Meteor.userId()) {
      this.render('defaultPage');
    } else {
      this.next();
    }
  },
  {except : ['claimConnection']}
);

Router.route('/call', function() {
  Meteor.subscribe("chatSession");
  this.render('videoCall');
});

Router.route('/call/:userId', function() {
  Meteor.subscribe("chatSession");
  this.render('videoCall', {data : {userId : this.params.userId}});
});

Router.route('/claimConnection', function () {
   this.render("claimConnection");
  }
);

Router.route('/admin', function () {
   this.render("admin");
  }
);

Router.route('/logout', function () {
  Meteor.logout();
  this.render("defaultPage");
});

Router.route('/inbox', function() {
  this.render('inbox');
});

Router.route('/contact', function() {
    this.render('contact');
});

Router.route('/about', function() {
    this.render('about');
});

Router.route('/inbox/test/', function() {
  console.log("Paramètre pseudo de la page : "+this.params.pseudo);
  this.render('inbox', {data : {pseudo : this.params.query.pseudo}});
});

Router.route('/courses/matierePost/:_id', {
    name:'matierePost',
    data: function() {
        //var a = SkillList.findOne({_id :this.params._id});
        //skill_name = a.name;
        //console.log(skill_name);
        //Session.set('matierePage',skill_name);
        return SkillList.findOne({_id :this.params._id}); }
});

Router.route('/courses/listeTuteur/:_id', {
    name:'listeTuteur',
    data: function() {
        //var a = SkillList.findOne({_id :this.params._id});
        //skill_name = a.name;
        //console.log(skill_name);
        //Session.set('matierePage',skill_name);
        return SkillList.findOne({_id :this.params._id}); }
});

Router.route('/posts/:_id', {
        name: 'PostPage',
        data: function() { return Posts.findOne(this.params._id); }
    }
);
Router.route('/posts/:_id/edit', {
    name: 'postEdit',
    data: function() { return Posts.findOne(this.params._id); }
});

