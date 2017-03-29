var request = require('request');
var perlinGenerator = require("proc-noise");
var perlin = new perlinGenerator();
var perlin1 = new perlinGenerator();
var perlin2 = new perlinGenerator();
var config = require('config');

setInterval(sendDummyData.bind(this), config.get("dataInterval"));
var perlinIndex = 0;

function sendDummyData() {
    var json = {
        "recordBatch": [
            {
                "id": "t1",
                "timestamp": Date.now(),
                "sensorState": "online",
                "sensorBatteryLevel": 65,
                "type": "temperature",
                "unit": "Celsius",
                "value": perlin.noise(perlinIndex) * 45 - 15
            },
            {
                "id": "t2",
                "timestamp": Date.now(),
                "sensorState": "online",
                "sensorBatteryLevel": 50,
                "type": "temperature",
                "unit": "Celsius",
                "value": perlin1.noise(perlinIndex + 500) * 45 - 15
            },
            {
                "id": "t2",
                "timestamp": Date.now(),
                "sensorState": "online",
                "sensorBatteryLevel": 50,
                "type": "temperature",
                "unit": "Celsius",
                "value": perlin2.noise(perlinIndex + 250) * 45 - 15
            }
        ]
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
        if (res)
            console.log("Send request! Got back status code: " + res.statusCode);
        if (err)
            console.log("Woops! " + err);
        
        console.log(json);
    });
    
    if(perlinIndex < Number.MAX_SAFE_INTEGER - 501)
        perlinIndex += 0.1;
    else
        perlinIndex = 0;
}