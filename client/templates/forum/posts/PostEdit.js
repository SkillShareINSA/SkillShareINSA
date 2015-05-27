/**
 * Created by chao on 15-5-11.
 */
Template.PostEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentPostId = this._id;

        var postProperties = {
            matiereName:Posts.findOne({_id :this._id}).matiereName,
            title: $(e.target).find('[name=title]').val()
        }

        Posts.update(currentPostId, {$set: postProperties}, function(error) {
            if (error) {
                // 向用户显示错误信息
                alert(error.reason);
            } else {
                Router.go('PostPage', {_id: currentPostId});
            }
        });
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            var currentPostId = this._id;
            var skill_id = SkillList.findOne({name:Posts.findOne({_id :this._id}).matiereName})._id;
            Posts.remove(currentPostId);
            Router.go('/courses/matierePost/'+skill_id);
        }
    }
});