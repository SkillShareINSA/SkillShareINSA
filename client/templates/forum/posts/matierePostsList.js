/**
 * Created by chao on 15-5-12.
 */
Template.matierePostsList.helpers({
    posts: function() {
        var skill_name = SkillList.findOne({_id :this._id}).name;
        console.log('take care '+this._id);
        return Posts.find({matiereName:skill_name}, {sort: {submitted: -1}});
    }
});
