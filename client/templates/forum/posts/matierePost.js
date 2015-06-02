/**
 * Created by chao on 15-5-17.
 */
Template.matierePost.helpers({
    matierePage: function() {
        console.log(this._id);
        return Session.get('matierePage'); },
    matiereName: function(){
        var skill_name = SkillList.findOne({_id :this._id}).name;
        console.log(skill_name);
        return skill_name;
    }
})

Template.matierePost.events({
    'click #etreUnTuteur' : function(event) {
        console.log('insert');
        Meteor.call('addTuteur',this._id);
    }
})
