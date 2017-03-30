/**
 * user-model.js
 * Created on 27-03-2017
 * @author Swen Meeuwes
 * 
 * A model which represents an user
 **/

var SHA256 = require('crypto-js/sha256');

var UserModel = {};

var User = function (properties) {
    this.username = properties.username;
    this.password = properties.password;
    this.email = properties.email;
    this.salt = properties.salt;
    this.secret = properties.secret;
};

UserModel.constructor = User;

UserModel.login = function (session, requestBody) {
    return new Promise(function (resolve, reject) {
        var user = session.run("MATCH (u:User {username:{username}}) return u AS User;", {username: requestBody.username});
        user.then(function (result) {
            if (result.records[0]) {
                var properties = result.records[0]._fields[0].properties;
                var hashedPassword = properties.password;
                if (SHA256(requestBody.password + properties.salt).toString() === hashedPassword) {
                    session.close();
                    resolve();
                } else {
                    session.close();
                    reject({code: 403, message: "Wrong password"});
                }
            } else {
                session.close();
                reject({code: 404, message: "No such user found!"});
            }
        });
    });
};

UserModel.register = function (session, requestBody) {
    return new Promise(function (resolve, reject) {
        var user = session.run("MATCH (u:User {username:{username}}) RETURN u AS User;", {username: requestBody.username});
        user.then(function (result) {
            if (result.records[0]) {
                session.close();
                reject({message: "Username already in use!"});
            } else {
                var newUser = session.run("CREATE (u:User {username:{username},password:{password}, email: {email}, salt: {salt}, secret: {secret}});", requestBody);
                newUser.then(function () {
                    session.close();
                    resolve(new User(requestBody));
                });
            }
        });
    });
};

UserModel.getAll = function (session) {
    return new Promise(function (resolve, reject) {
        var users = session.run("MATCH (u:User) return u AS User;");
        users.then(function (result) {
            if (result.records[0]) {
                var userArray = [];
                for (var i = 0; i < result.records.length; i++) {
                    userArray.push(new User(result.records[i]._fields[0].properties)); // Find a method to do this properly (result.records ... ._fields
                }
                session.close();
                resolve(userArray);
            } else {
                session.close();
                resolve([]);
            }
        });
    });
};

UserModel.getByID = function (session, id) {
    // return promise

    session.close();
};

module.exports = UserModel;