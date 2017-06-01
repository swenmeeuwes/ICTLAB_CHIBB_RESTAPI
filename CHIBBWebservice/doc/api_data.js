define({ "api": [
  {
    "type": "get",
    "url": "/sensor/data/:id",
    "title": "Request Sensor data",
    "name": "GetSensorData",
    "group": "Sensor",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Sensors unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "statusCode",
            "description": "<p>The reponse status code.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "statusMessage",
            "description": "<p>A readable response status code.</p>"
          },
          {
            "group": "Success 200",
            "type": "Record[]",
            "optional": false,
            "field": "result",
            "description": "<p>An array of records.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "resultLength",
            "description": "<p>Length of the result array.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.0 200 OK\n{\n  \"statusCode\": 200,\n  \"statusMessage\": \"OK\",\n  \"result\": [\n     {\n         \"timestamp\": 1496327072,\n         \"unit\": \"Celcius\",\n         \"value\": 18\n     },\n     {\n         \"timestamp\": 1496328072,\n         \"unit\": \"Celcius\",\n         \"value\": 16\n     }\n  ],\n  \"resultLength\": 2\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SensorNotFound",
            "description": "<p>The id of the Sensor was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.0 404 Not Found\n{\n  \"statusCode\": 404,\n  \"statusMessage\": \"Not Found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/sensor.js",
    "groupTitle": "Sensor"
  }
] });
