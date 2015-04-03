Template.connect.events({
  'submit' : function (event) {
    var form = {};
    $.each($('#loginForm').serializeArray(), function() {
      form[this.name] = this.value;
    });

    Meteor.loginWithPassword(form['username'], form['password'], function(err) {
      if (!err) {
        console.log('User logged in : ' + Meteor.userId());
      } else {
        console.log('User logged in failed : ' + err.reason);
      }
    });
    return false;
  }
});