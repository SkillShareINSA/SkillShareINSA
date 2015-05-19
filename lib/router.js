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

