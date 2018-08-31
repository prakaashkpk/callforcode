// test
var damMeasuresSchema = {
    "type": "object",
    "properties": {
        "damMeasures": {
            "type": "array",
            "minItems": 10,
            "maxItems": 10,
            "uniqueItems": true,
            "items": {
                "type": "object",
                "properties": {

                    "id": {
                        type: "integer",
                        unique: true,
                        initialOffset: 1,
                        autoIncrement: true
                    },

                    "measuredate": {
                        type: "string",
                        format: "date-time"
                    },

                    "currentWaterLevel": {
                        type: "integer",
                        minimum: 10,
                        maximum: 1800
                    },

                    "inflowRate": {
                        type: "integer",
                        minimum: 100,
                        maximum: 6000
                    },

                    "outflowRate": {
                        type: "integer",
                        minimum: 100,
                        maximum: 300
                    },

                    "seepageRate": {
                        type: "integer",
                        minimum: 300,
                        maximum: 400
                    },

                    "predictedRainfall": {
                        type: "integer",
                        minimum: 50,
                        maximum: 100
                    },

                    "activeRainfall": {
                        type: "integer",
                        minimum: 50,
                        maximum: 100
                    },

                    "windSpeed": {
                        type: "integer",
                        minimum: 1,
                        maximum: 300
                    },

                    "evaporationRate": {
                        type: "integer",
                        minimum: 0,
                        maximum: 3
                    },

                },
                "required": ["id", "measuredate", "currentWaterLevel", "inflowRate", "outflowRate", "seepageRate", "predictedRainfall", "activeRainfall", "windSpeed", "evaporationRate"]
            }
        }
    },
    "required": ["damMeasures"]
}

module.exports = damMeasuresSchema;
