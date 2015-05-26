if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("Server initialization", function(){
      it("should have a Meteor version defined", function(){
        chai.assert(Meteor.release);
      });
    });
  });

  // publish nightmare to client, since npm modules cannot be directly used
  Meteor.methods({
    'newNightmare': function() {
      var Nightmare = Meteor.npmRequire('nightmare');
      return Nightmare;
    }
  });
}
