/**
 * test.js
 * Created on 10-06-2017
 * @author Swen Meeuwes
 * 
 * A series of unit tests, using the 'mocha' test framework
 **/

var assert = require('assert');

describe('User', function () {
    var SHA256 = require('crypto-js/sha256');
    var randomString = require('randomstring');
    var jwt = require('jsonwebtoken');

    var User = require('../webservice/models/user-model').constructor;

    var actualPassword;
    var user;
    var tokenSecret;

    before(function () {
        // Generate some test variables
        tokenSecret = randomString.generate(16);
        actualPassword = randomString.generate(8);

        var salt = randomString.generate(16);
        var secret = randomString.generate(16);

        // Construct an user
        var email = "user@gmail.com";
        var username = "User";
        var password = SHA256(actualPassword + salt).toString();


        user = new User({
            username: username,
            password: password,
            email: email,
            salt: salt,
            secret: secret
        });
    });

    after(function () {
        // Cleanup
        delete actualPassword;
        delete user;
        delete tokenSecret;
    });

    beforeEach(function () {

    });

    afterEach(function () {

    });

    describe('#Password encryption', function () {
        it('should not store the plain password of the user', function () {
            assert.notEqual(actualPassword, user.password);
        });

        it('should correctly encrypt the password of the user', function () {
            var encryptedPassword = SHA256(actualPassword + user.salt).toString();
            assert.equal(encryptedPassword, user.password);
        });
    });

    describe('#Token validation', function () {
        var userToken;

        it('should create a new token if requested', function (done) {
            assert.doesNotThrow(function () {
                userToken = jwt.sign({
                    username: user.username
                }, tokenSecret, {expiresIn: '1m'}, done());
            });
            
            if(!userToken)
                assert.fail(userToken + " is not a valid token");
        });

        it('should decode the token if it is valid', function (done) {
            jwt.verify(userToken, tokenSecret, function (error, decoded) {
                if(error)
                    assert.fail("Seen a valid token as invalid");
                assert.deepStrictEqual(decoded.username, user.username);
                done();
            });
        });

        it('shouldn\'t decode the token if it invalid', function (done) {
            jwt.verify(userToken, tokenSecret + "_wrongsecret", function (error, decoded) {
                if (!error)
                    assert.fail(error.message);
                done();
            });
        });
    });
});