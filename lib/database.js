SkillList = new Meteor.Collection('SkillList');
ChatMessages = new Meteor.Collection('chatMessages');
Messages = new Meteor.Collection("messages");
Posts = new Mongo.Collection('posts');
Comments = new Mongo.Collection('comments');

if (Meteor.isServer) {

 Meteor.methods({
     commentInsert: function(commentAttributes) {
         check(this.userId, String);
         check(commentAttributes, {
             postId: String,
             body: String
         });
         var user = Meteor.user();
         var post = Posts.findOne(commentAttributes.postId);
         if (!post)
             throw new Meteor.Error('invalid-comment', 'You must comment on a post');
         comment = _.extend(commentAttributes, {
             userId: user._id,
             author: user.username,
             submitted: new Date()
         });
         return Comments.insert(comment);
     },
     postInsert: function(postAttributes) {
         check(Meteor.userId(), String);
         check(postAttributes, {
             title: String,
             matiereName: String
         });
         var user = Meteor.user();
         var post = _.extend(postAttributes, {
             userId: user._id,
             author: user.username,
             submitted: new Date()
         });
         var postId = Posts.insert(post);
         return {
             _id: postId
         };
     },
     addTuteur: function(skillID) {
         var user = Meteor.user();
         SkillList.update(skillID, {

             $addToSet: {teachers: user.username}
         });
     },
    insertMessage: function (message) {
      //vérification des données envoyé par l'utilisateur
      var local_user =  Meteor.users.find({username : message.from}).fetch()[0];
      var distant_user = Meteor.users.find({username : message.to}).fetch()[0];
      //console.log("Debug insertMessage => this.userId  : " + this.userId + "local user Id : " + local_user._id + " distant_user typeof : " + (typeof distant_user));
      console.log("Distant user : " + distant_user.username + " Local user : " + local_user.username);
      //envoi du message 
      if((local_user._id==this.userId) && (typeof distant_user != undefined)){
        Messages.insert(message);
        Meteor.users.update(distant_user._id, {$set: {nb_unread_messages : distant_user.nb_unread_messages + 1}});
        }
      else{
        console.log("Essai frauduleux d'insertion");
      }

    },
    resetUser: function(JSON){
      console.log("fonction reset");
      Meteor.users.update(this.userId, {$set: {nb_unread_messages : 0}});
    }

  });

  Meteor.publish('chatSession', function() {
    if (this.userId != null) {
      return ChatMessages.find({ $or: [
        {sender_id: this.userId},
        {receiver_id: this.userId}
      ]});
    }
    else
      return null;
  });



  Meteor.publish('skillList', function() {
      return SkillList.find({});
    }
  );
    Meteor.publish('posts', function() {
        console.log("post return complete!");
        return Posts.find();
    });

    Meteor.publish('comments', function() {
        return Comments.find();
    });

  Meteor.publish("messages", function () {
    if (this.userId != null) {
      var user = Meteor.users.find({_id : this.userId}).fetch()[0];
      console.log(this.userId);


      return Messages.find({
        $or: [
          { to: user.username },
          { from: user.username }
        ]
        });

      }
    else
      return [];
    }
  );



  Meteor.publish('usersStatus', function() {
    return Meteor.users.find({}, {fields: {"status.online" : 1, emails : 1, username : 1, nb_unread_messages : 1}});
  });


  SkillList.allow({
    insert : function(userId, doc) {
      return userId != null;
    },
    remove : function(userId, doc) {
      return userId != null;
    }
  });
    Posts.allow({
        insert: function(userId, doc) {
            // 只允许登录用户添加帖子
            return !! userId;
        },
        update: function(userId, post) { return ownsDocument(userId, post); },
        remove: function(userId, post) { return ownsDocument(userId, post); }
    });
  ChatMessages.allow({
    insert : function(userId, doc) {
      return userId != null;
    }
  });
} else if (Meteor.isClient) {
  Meteor.startup(function() {
    Session.set('users_loaded', false); 
  });
  Deps.autorun(function() {
    Meteor.subscribe("messages");
    Meteor.subscribe('usersStatus', function() {
      Session.set('users_loaded', true);
    });
  });
  Meteor.subscribe('skillList');
    Meteor.subscribe('posts');
    Meteor.subscribe('comments');
}

ownsDocument = function(userId, doc) {
    return doc && doc.userId === userId;
}