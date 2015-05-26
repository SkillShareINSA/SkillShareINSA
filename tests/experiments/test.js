var path = require('path');
var Nightmare = require('nightmare');
var chai = require('chai');

var expect = chai.expect;
var should = chai.should;
 
describe('DOM Testing', function () {
    this.timeout(30000); // Set timeout to 15 seconds, instead of the original 2 seconds
 
    var url = 'http://localhost:3000/call';
 
    describe('Call page', function () {
        describe('not logged in', function() {
            it('shouldn\'t display remote video', function (done) {
                new Nightmare()
                    .goto(url)
                    .evaluate(function() {
                        return document.getElementByTagName('video');
                    }, function(result) {
                        expect(result).eql(null);
                    })
                    .run(done);
            });
            it('take a screenshot', function(done) {
                //this.timeout(30000);
                new Nightmare()
                    .goto(url)
                    .wait()
                    .screenshot('screenshots/call-not-logged-in.png')
                    .run(done);
            });
        });
        describe('logged in', function() {
            this.timeout(60000); 
            it('should display remote video', function(done) {
                new Nightmare()
                    .goto(url)
                    .click('#connectButton')
                    .wait()
                    .screenshot('screenshots/CAS.png')
                    .authentication('hadang','--jPtf')
                    .evaluate(function() {
                        return document.getElementByTagName('video');
                    }, function(result) {
                        expect(result).eql('VIDEO');
                    })
                    .run(done);
            });
        });
    });
 /*
    describe('Send form', function () {
        it('should print the posted string on submit', function (done) {
            var expected = 'Hello, world!';
 
            new Nightmare()
                .goto(url)
                .type('input[name="sometext"]', expected)
                .click('input[type="submit"]')
                .wait()
                .evaluate(function () {
                    return document.querySelector('#result');
                }, function (element) {
                    element.innerText.should.equal(expected);
                    done();
                })
                .run();
        });
 
        it('should print "nothing" on submit if no string were provided', function (done) {
            var expected = 'nothing';
 
            new Nightmare()
                .goto(url)
                .click('input[type="submit"]')
                .wait()
                .evaluate(function () {
                    return document.querySelector('#result');
                }, function (element) {
                    element.innerText.should.equal(expected);
                    done();
                })
                .run();
        });
    });*/
});