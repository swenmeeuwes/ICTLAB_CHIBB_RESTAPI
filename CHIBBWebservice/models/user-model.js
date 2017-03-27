/**
 * user-model.js
 * Created on 27-03-2017
 * @author Swen Meeuwes
 * 
 * A model which represents an user
 **/

var userModel = {};

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