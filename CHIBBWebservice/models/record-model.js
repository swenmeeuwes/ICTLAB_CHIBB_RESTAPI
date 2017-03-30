/**
 * sensor-model.js
 * Created on 29-03-2017
 * @author Jesse van Breda & Swen Meeuwes
 * 
 * A model which represents a sensor
 **/

var recordModel = {};

/**
* This constructor contains a for loop, because it dynamically creates attributes.
* For example, if a user created this sensor, and the following record comes in:
* Sensor: {sid: 1,type: "Temperature", attributes: ["value", "unit"]},
* Record: {id: 1, timestamp: 1402820292, type: "Temperature", batteryLevel: 90, value: 12, unit: "Celsius"}
* This for loop created the following model if the user is trying to get the records from this sensor:
* {this.value = 12, this.unit = "Celsius"}
* 
* So, only the attributes provided by the user himself get selected for his model
**/

// To-do: Make a seperate method for the filtering, since this behaviour is not expected from a constructor
var Record = function (properties, sensorAttributes) {
    for(var i = 0; i < sensorAttributes.length; i++){
        this[sensorAttributes[i]] = properties[sensorAttributes[i]];
    }
};

recordModel.constructor = Record;

// Rename to createData
recordModel.postData = function (session, requestBody) {
    return new Promise(function (resolve, reject) {
        var sensors = session.run("MATCH (s:Sensor) return s AS Sensor;");
        sensors.then(function (result) {
            if (result.records[0]) {
                var newSensorData = requestBody.recordBatch;
                for (var i = 0; i < newSensorData.length; i++) {
                    var record = session.run("MATCH (s:Sensor {sid:{sid}}) CREATE ((s) -[r:Has_record]-> (re:Record{timestamp:{timestamp}, sensorState:{sensorState}, sensorBatteryLevel:{sensorBatteryLevel}, unit:{unit}, value:{value} }));",
                            {sid: newSensorData[i].id, timestamp: newSensorData[i].timestamp, sensorState: newSensorData[i].sensorState, sensorBatteryLevel: newSensorData[i].sensorBatteryLevel, unit: newSensorData[i].unit, value: newSensorData[i].value});
                        record.then(function(){
                            resolve(requestBody);
                        });
                }
            }
            else {
                reject({message: "No sensor with that id found!"});
            }
        });
    });
    session.close();
};

module.exports = recordModel;


