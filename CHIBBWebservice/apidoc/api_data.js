define({ "api": [
  {
    "type": "get",
    "url": "/sensor/id/:id",
    "title": "Request Sensor info",
    "version": "0.0.1",
    "name": "GetSensorById",
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
            "type": "String",
            "optional": false,
            "field": "sid",
            "description": "<p>The unique identifier of the Sensor.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hid",
            "description": "<p>The unique identifier of the House.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>The human-readable location of the Sensor.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>The type of the Sensor.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "attributes",
            "description": "<p>The attributes that the Sensor tracks.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.0 200 OK\n{\n  \"statusCode\": 200,\n  \"statusMessage\": \"OK\",\n  \"result\": [\n     {\n         \"sid\": \"2ke98E37YeVh\",\n         \"hid\": \"i3djTejk35e82\",\n         \"location\": \"Livingroom\",\n         \"type\": \"Temperature\",\n         \"attributes\": [\n             \"timestamp\",\n             \"unit\",\n             \"value\"\n         ]\n     }\n  ],\n  \"resultLength\": 1\n}",
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
    "filename": "routes/sensor.js",
    "groupTitle": "Sensor"
  },
  {
    "type": "get",
    "url": "/sensor/data/:id",
    "title": "Request Sensor data",
    "version": "0.0.1",
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
    "filename": "routes/sensor.js",
    "groupTitle": "Sensor"
  },
  {
    "type": "get",
    "url": "/sensor/status/:id",
    "title": "Request Sensor status",
    "version": "0.0.1",
    "name": "GetSensorStatus",
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
            "field": "batteryLevel",
            "description": "<p>Percentage of battery remaining.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The current status of the requested sensor: Clean (sensor does not exists), Active (running), Intermittent failures (no data for 3 sec), Inactive (no data for 30 sec).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (sensor exists):",
          "content": "HTTP/1.0 200 OK\n {\n     \"statusCode\": 200,\n     \"statusMessage\": \"OK\",\n     \"result\": {\n         \"sid\": \"t1\",\n         \"status\": \"Inactive\",\n         \"batteryLevel\": 65\n     }\n }",
          "type": "json"
        },
        {
          "title": "Success-Response (sensor does not exists):",
          "content": "HTTP/1.0 200 OK\n {\n     \"statusCode\": 200,\n     \"statusMessage\": \"OK\",\n     \"result\": {\n         \"sid\": \"t4\",\n         \"status\": \"Clean\",\n         \"batteryLevel\": null\n     }\n }",
          "type": "json"
        }
      ]
    },
    "filename": "routes/sensor.js",
    "groupTitle": "Sensor"
  }
] });
