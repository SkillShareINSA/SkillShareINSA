/**
 * Created by chao on 15-5-17.
 */
Template.matierePost.helpers({
    matierePage: function() {
        console.log(this._id);
        return Session.get('matierePage'); }
})
