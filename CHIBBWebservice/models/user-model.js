/**
 * user-model.js
 * Created on 27-03-2017
 * @author Swen Meeuwes
 * 
 * A model which represents an user
 **/

var userModel = {};

userModel.register = function (session) {
    // To-do:
    return new Promise(function (resolve, reject) {
        var user = session.run("MATCH (u:User) WHERE u.username = {username} RETURN u;", {username: "henk"});
        user.then(function (result) {

            var user = result.records.map(function(record) {
                return new User(record.get('user'));
            });
            resolve(result);
        });
    });
};

userModel.getAll = function (session) {
//    return new Promise((resolve, reject) => {
//        
//    });

    session.close();
};

userModel.getByID = function (session, id) {
    // return promise

    session.close();
};

module.exports = userModel;