var path = require('path');
var Nightmare = require('nightmare');
var chai = require('chai');
var should = require('should');

var expect = chai.expect;
var should = chai.should;
 
describe('DOM Testing', function () {
    this.timeout(30000); // Set timeout to 15 seconds, instead of the original 2 seconds
 
    var url = 'http://localhost:3000/call';
 
    describe('Video call page', function () {
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
                    .viewport(800, 600)
                    .goto(url)
                    .wait()
                    .screenshot('screenshots/call-not-logged-in.png')
                    .run(done);
            });
        });
        describe('logged in', function() {
            this.timeout(90000); 
            it('should display remote video', function(done) {
                new Nightmare()
                    .goto(url)
                    .click('#login-sign-in-link')
                    .type('input#login-username', 'user_test1')
                    .type('input#login-password', '123456')
                    .click('#login-buttons-password')
                    .wait()
                    .screenshot('screenshots/call-logged-in.png')
                    .evaluate(function() {
                        return document.getElementById('remoteVideo');
                    }, function(result) {
                        expect(result.nodeName).eql('VIDEO');
                    })
                    .run(done);
            });
            it('should have two video tags', function(done) {
                 new Nightmare()
                    .goto(url)
                    .click('#login-sign-in-link')
                    .type('input#login-username', 'user_test')
                    .type('input#login-password', '123456')
                    .click('#login-buttons-password')
                    .wait()
                    .evaluate(function() {
                        return document.getElementsByTagName('video');
                    }, function(result) {
                        result.length.should.be.exactly(2);
                    })
                    .run(done);
            })
            it('should go full screen when clicking on resize', function(done) {
                   new Nightmare()
                    .goto(url)
                    .click('#login-sign-in-link')
                    .type('input#login-username', 'user_test')
                    .type('input#login-password', '123456')
                    .click('#login-buttons-password')
                    .wait()
                    .click('i.fa-arrows-alt')
                    .evaluate(function() {
                        return document.getElementById('videoWindow');
                    }, function(result) {
                        result.className.indexOf('full-screen').should.be.above(-1);
                    })
                    .run(done);
            })
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