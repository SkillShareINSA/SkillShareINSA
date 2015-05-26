/**
 * Created by chao on 15-5-11.
 */
Template.PostItem.helpers({
    ownPost: function() {
        return this.userId === Meteor.userId();
    },
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
     },
    commentsCount: function() {
        return Comments.find({postId: this._id}).count();
    }
});
