// A dirty quick fix for the fact that there are no sensors available :/
// This script keeps sending http post requests to the CHIBB RESTfull webservice
// Values are generated with Perlin Noise, which results in 'smooth random' results
// Because of this the visualisations will look like they make more sense, even though the data is random 

var request = require('request');
var perlinGenerator = require("proc-noise");
var perlin = new perlinGenerator();
var perlin1 = new perlinGenerator();
var perlin2 = new perlinGenerator();
var perlin3 = new perlinGenerator();
var perlin4 = new perlinGenerator();
var config = require('config');

var batteryLevel1 = 50;
var batteryLevel2 = 5;
var batteryLevel3 = 33;
var batteryLevel4 = 45;

var batteryLevels = [];

var recordBatch = [];
var sensor1;
var sensor2;
var sensor3
var sensor4;

var sensors = [];

setInterval(sendDummyData.bind(this), config.get("dataInterval"));
var perlinIndex = 0;

function generateData(){
	sensor1 = {
                "id": "t1",
                "timestamp": Date.now(),
                "sensorState": "online",
                "sensorBatteryLevel": batteryLevel1,
                "type": "temperature",
                "unit": "Celsius",
                "value": perlin.noise(perlinIndex) * 45 - 15
            };
	sensor2 = {
                "id": "sh1",
                "timestamp": Date.now(),
                "sensorState": "online",
                "sensorBatteryLevel": batteryLevel2,
                "type": "soil humidity",
                "unit": "%",
                "value": perlin1.noise(perlinIndex + 500) * 45 - 15
            };
	sensor3 = {
                "id": "l1",
                "timestamp": Date.now(),
                "sensorState": "online",
                "sensorBatteryLevel": batteryLevel3,
                "type": "light",
                "unit": "Lumen",
                "value": perlin2.noise(perlinIndex + 250) * 45 - 15
            };
	sensor4 = {
                "id": "ph1",
                "timestamp": Date.now(),
                "sensorState": "online",
                "sensorBatteryLevel": batteryLevel4,
                "type": "pH",
                "unit": "pH",
                "value": perlin2.noise(perlinIndex + 250) * 45 - 15
            };
			
	sensors = [sensor1, sensor2, sensor3, sensor4];
}

function setBatteryLife(){
	var random = Math.random();
	if(random < 0.2){
		batteryLevel1--;
		batteryLevel2--;
		batteryLevel3--;
		batteryLevel4--;
	}
	
	batteryLevels = [batteryLevel1, batteryLevel2, batteryLevel3, batteryLevel4];
}

function setData(){
	for(var i = 0; i < sensors.length; i++){
		if(batteryLevels[i] > 0)
			recordBatch.push(sensors[i]);
	}
}

function sendDummyData() {
	recordBatch = [];
	generateData();
	setBatteryLife();
	setData();
	
    var json = {
        "recordBatch": recordBatch
    };

    var options = {
        url: 'http://localhost:8081/record/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: json
    };

    request(options, function (err, res, body) {
        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
            console.log(body);
        }
        if (res){}
            console.log("Send request! Got back status code: " + res.statusCode);
        if (err){}
            console.log("Woops! " + err);
        
        console.log(json);
    });
    
    if(perlinIndex < Number.MAX_SAFE_INTEGER - 501)
        perlinIndex += 0.1;
    else
        perlinIndex = 0;
}