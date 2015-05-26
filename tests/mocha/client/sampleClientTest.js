assert = chai.assert;
expect = chai.expect;
if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("DOM Tests", function() {
      console.log('dsadsadsa');
      Meteor.call('newNightmare', function(result) {
        var videoCallURL = "/call";
        console.log('dsadsadsa' + result);
        var Nightmare = result;
        describe("Page appel video", function() {
        	it("la video doit etre de type autoplay", function(done){
            new Nightmare()
              .goto(videoCallURL)
              .evaluate(function() {
                return document.getElementById('remoteVideo');
            	}, function(result) {
        			  expect(result.nodeName).eql('VIDEO');
              })
              .run(done);
      	  });
        });
      })
    });
  });
}

