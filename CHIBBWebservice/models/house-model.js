/**
 * house-model.js
 * Created on 27-03-2017
 * @author Jesse van Breda & Swen Meeuwes
 * 
 * A model which represents a house
 **/

var houseModel = {};

houseModel.getAll = function (session) {
//    return new Promise((resolve, reject) => {
//        
//    });

    session.close();
};

houseModel.getByID = function (session, id) {
    // return promise
    
    session.close();
};

module.exports = houseModel;