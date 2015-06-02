/**
 * Created by chao on 15-5-17.
 */
Template.listeTuteur.helpers({
    liste:function(){
        console.log(this._id);
        return SkillList.find({id:this.id}).teachers;
    },
    matiereName: function(){
        var skill_name = SkillList.findOne({_id :this._id}).name;
        console.log(skill_name);
        return skill_name;
    }

})

Template.listeTuteur.events({
    'click #etreUnTuteur' : function(event) {
        console.log('insert');
        Meteor.call('addTuteur',this._id);
    }
})