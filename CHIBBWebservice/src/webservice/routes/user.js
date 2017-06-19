/**
 * user.js
 * Created on 27-03-2017
 * @author Swen Meeuwes
 * 
 * API user route
 **/

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

var dbConnector = require('../database/database-connector');

//var secret = require('../providers/token-secret-provider'); // The way it could be :c
var fs = require('fs');
var secret = fs.readFileSync('./assets/token.secret', 'utf8');

var SHA256 = require('crypto-js/sha256');
var randomString = require('randomstring');

var userModel = require('../models/user-model');

// middleware that is specific to this router
//router.use(function timeLog (req, res, next) {
//  console.log('Time: ', Date.now())
//  next()
//});

/**
 * @api {post} /user/ Register a User
 * @apiVersion 0.0.1
 * @apiName RegisterUser
 * @apiGroup User
 * 
 * @apiParam {String} username Username of the User.
 * @apiParam {String} password Password of the User.
 * @apiParam {String} email E-mail of the User.
 *
 * @apiSuccess {Number} statusCode The reponse status code.
 * @apiSuccess {String} statusMessage A readable response status code.
 * @apiSuccess {String} username The username of the newly created user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "statusCode": 201,
 *       "statusMessage": "Created",
 *       "result": [
 *          {
 *              "username": "chibb_user"
 *          }
 *       ],
 *       "resultLength": 1
 *     }
 *
 * @apiError UsernameAlreadyInUse A User with the provided username already exists!
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "statusCode": 409,
 *       "statusMessage": "Conflict",
 *       "message": "Username already in use!"
 *     }
 */
router.post('/register', function (req, res) {
    var requestBody = req.body;
    var salt = randomString.generate(16);
    var secret = randomString.generate(16);

    var password = SHA256(requestBody.password + salt).toString();

    var registerPromise = userModel.register(dbConnector.getSession(req),
            {
                username: requestBody.username,
                password: password,
                email: requestBody.email,
                salt: salt,
                secret: secret
            });

    registerPromise.then(function (data) {
        res.created({user: data});
    }).catch(function (error) {
        res.ok({error: error.message});
    });
});

/**
 * @api {post} /user/ Login as a User
 * @apiVersion 0.0.1
 * @apiName LoginUser
 * @apiGroup User
 * 
 * @apiParam {String} username Username of the User.
 * @apiParam {String} password Password of the User.
 * 
 * @apiSuccess {Number} statusCode The reponse status code.
 * @apiSuccess {String} statusMessage A readable response status code.
 * @apiSuccess {String} username The username of the newly created user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "statusCode": 200,
 *       "statusMessage": "OK",
 *       "result": [
 *          {
 *              "token": "a nicely composed token"
 *          }
 *       ],
 *       "resultLength": 1
 *     }
 *
 * @apiError UserNotFound No User with the provided username was found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "statusCode": 404,
 *       "statusMessage": "Not Found",
 *       "message": "No such user found!"
 *     }
 *     
 * @apiError NotAuthorized The provided password didn't match the Users password
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "statusCode": 401,
 *       "statusMessage": "Unauthorized",
 *       "message": "Wrong password"
 *     }
 */
router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var loginPromise = userModel.login(dbConnector.getSession(req), req.body);
    loginPromise.then(function () {
        var token = jwt.sign({
            username: username
            // Doesn't need a timestamp?
        }, secret, {expiresIn: '12h'});

        res.ok({token: token});
    }).catch(function (error) {
        switch(error.code) {
            case 403:
                res.forbidden(error.message);
                break;
            case 404:
                res.notfound(error.message);
                break;
            default:
                res.interalservererror();
                break;
        }
    });
});

module.exports = router;