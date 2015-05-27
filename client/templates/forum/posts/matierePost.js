/**
 * Created by chao on 15-5-17.
 */
Template.matierePost.helpers({
    matierePage: function() {
        console.log(this._id);
        return Session.get('matierePage'); }
})

Template.matierePost.events({
    'click #etreUnTuteur' : function(event) {
        console.log('insert');
        Meteor.call('addTuteur',this._id);
    }
})
