var request = require('request');

setInterval(sendDummyData.bind(this), 1000);

function sendDummyData() {
    var json = {
        "recordBatch": [
            {
                "id": "1a",
                "timestamp": Date.now(),
                "sensorState": "online",
                "sensorBatteryLevel": 65,
                "type": "temperature",
                "unit": "Celsius",
                "value": Math.random() * 40 - 10
            },
			{
				"id": "2a",
                "timestamp": Date.now(),
                "sensorState": "online",
                "sensorBatteryLevel": 65,
                "type": "temperature",
                "unit": "Celsius",
                "value": Math.random() * 40 - 10
			}
        ]
    };

    var options = {
        url: 'http://127.0.0.1:8081/record',
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
    });
}