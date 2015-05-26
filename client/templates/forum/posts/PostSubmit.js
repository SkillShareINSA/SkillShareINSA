/**
 * Created by chao on 15-5-10.
 */
Template.PostSubmit.events({
    'submit form': function(e,template) {
        e.preventDefault();
        var matiereName_tmp = SkillList.findOne({_id :template.data._id}).name;
        var post = {
            title: $(e.target).find('[name=title]').val(),
            matiereName:matiereName_tmp
        };

        Meteor.call('postInsert', post, function(error, result) {
            // 向用户显示错误信息并终止
            if (error)
                return alert(error.reason);

            // 显示结果，跳转页面
            if (result.postExists)
                alert('This link has already been posted（该链接已经存在）');

            console.log(template.data._id);

            Router.go('PostPage', {_id: result._id});
        });
    }
});
