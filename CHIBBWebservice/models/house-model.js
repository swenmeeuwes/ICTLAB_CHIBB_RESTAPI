/**
 * house-model.js
 * Created on 27-03-2017
 * @author Jesse van Breda & Swen Meeuwes
 * 
 * A model which represents a house
 **/

var houseModel = {};

var House = function (properties) {
    this.hid = properties.hid;
    this.address = properties.address;
};

houseModel.constructor = House;

// Get all houses in the database (for admin purposes)
houseModel.getAllHouses = function (session) {
    return new Promise(function (resolve, reject) {
        var houses = session.run("MATCH (h:House) return h AS House;");
        houses.then(function (result) {
            if (result.records[0]) {
                var houseArray = [];
                for (var i = 0; i < result.records.length; i++) {
                    houseArray.push(new House(result.records[i]._fields[0].properties));
                }
                resolve(houseArray);
            }
            else {
                resolve([]);
            }
        });
    });
    session.close();
};

// Get all houses owned by the logged in user
houseModel.getUserHouses = function (session, username) {
    return new Promise(function (resolve, reject) {
        var houses = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House) RETURN h AS House;", {username: username});
        houses.then(function (result) {
            if (result.records[0]) {
                var houseArray = [];
                for (var i = 0; i < result.records.length; i++) {
                    houseArray.push(new House(result.records[i]._fields[0].properties));
                }
                resolve(houseArray);
            }
            else {
                resolve([]);
            }
        });
    });
    session.close();
};

houseModel.getById = function (session, username, hid) {
    return new Promise(function (resolve, reject) {
        var houses = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House {hid: {hid}}) RETURN h AS House;", {username: username, hid: hid});
        houses.then(function (result) {
            if (result.records[0]) {
                var houseArray = [];
                for (var i = 0; i < result.records.length; i++) {
                    houseArray.push(new House(result.records[i]._fields[0].properties));
                }
                resolve(houseArray);
            }
            else {
                resolve([], {message: "House does not exist or is not yours!"});
            }
        });
    });
    session.close();
};

houseModel.createHouse = function (session, username, requestBody) {
    return new Promise(function (resolve, reject) {
        var house = session.run("MATCH (h:House {hid:{hid}}) return h AS House;", {hid: requestBody.hid});
        house.then(function (result) {
            if (result.records[0]) {
                reject({message: "House with that Id already exists!"});
            }
            else {
                var newHouse = session.run("MATCH (u:User {username:{username}}) CREATE ((u) -[r:Owns]-> (h:House{hid:{hid},address:{address}}));", {username: username, hid: requestBody.hid, address: requestBody.address});
                newHouse.then(function () {
                    resolve(new House(requestBody));
                });
            }
        });
    });
    session.close();
};

houseModel.updateHouse = function (session, username, hid, requestBody) {
    return new Promise(function (resolve, reject) {
        var house = session.run("MATCH (h:House {hid:{hid}}) return h AS House;", {hid: hid});
        house.then(function (result) {
            if (result.records[0]) {
                var house = session.run("MATCH (u:User {username:{username}}) -[r:Owns]-> (h:House{hid:{hid}}) RETURN h AS House;", {username: username, hid: hid});
                house.then(function (result) {
                    if (result.records[0]) {
                        var updatedHouse = session.run("MATCH (h:House {hid:{hid}}) SET h += {hid: {newId}, address: {newAddress}};", {hid: hid, newId: requestBody.hid, newAddress: requestBody.address});
                        updatedHouse.then(function () {
                            resolve(new House(requestBody));
                        });
                    }
                    else {
                        reject({message: "House with that id is not yours!"});
                    }
                });
            }
            else {
                reject({message: "House with that id does not exist!"});
            }
        });
    });
    session.close();
};

houseModel.deleteHouse = function (session, username, hid) {
    return new Promise(function (resolve, reject) {
        var house = session.run("MATCH (h:House {hid:{hid}}) return h AS House;", {hid: hid});
        house.then(function (result) {
            if (result.records[0]) {
                var house = session.run("MATCH (u:User {username:{username}}) -[r:Owns]-> (h:House{hid:{hid}}) RETURN h AS House;", {username: username, hid: hid});
                house.then(function (result) {
                    if (result.records[0]) {
                        var updatedHouse = session.run("MATCH (h:House {hid:{hid}}) DETACH DELETE h", {hid: hid});
                        updatedHouse.then(function () {
                            resolve(new House({hid: hid}));
                        });
                    }
                    else {
                        reject({message: "House with that id is not yours!"});
                    }
                });
            }
            else {
                reject({message: "House with that id does not exist!"});
            }
        });
    });
    session.close();
};

module.exports = houseModel;