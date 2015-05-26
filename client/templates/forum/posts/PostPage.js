/**
 * Created by chao on 15-5-11.
 */
Template.PostPage.helpers({
    comments: function() {
        return Comments.find({postId: this._id});
    }
});
