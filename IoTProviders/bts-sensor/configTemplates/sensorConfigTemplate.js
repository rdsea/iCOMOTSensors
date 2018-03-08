export let batteryCurrent = {
    "protocol": "http",
    "protocolOptions": {

    },
    "format": "csv",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
    "uri": "http://localhost:3000/",
    "file": "data.csv",
    "measurement": "current",
    "unit": "ampere",
}

export let batteryVoltage = {
    "protocol": "http",
    "protocolOptions": {

    },
    "format": "csv",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
    "uri": "http://localhost:3000/",
    "file": "data.csv",
    "measurement": "voltage",
    "unit": "volt",
    "name": "bts-battery-voltage-sensor"
}

export let capacity = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic"
    },
    "format": "csv",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
    "uri": "http://localhost:3000/",
    "file": "data.csv",
    "measurement": "capacitance",
    "unit": "farad",
    "name": "bts-capacity-sensor"
}

export let generatorVoltage = {
    "protocol": "http",
    "protocolOptions": {

    },
    "format": "json",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
    "uri": "http://localhost:3000/",
    "file": "data.csv",
    "measurement": "voltage",
    "unit": "volt",
    "name": "bts-generator-voltage-sensor"
}

export let gridload = {
    "protocol": "http",
    "protocolOptions": {

    },
    "format": "json",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
    "uri": "http://localhost:3000/",
    "file": "data.csv",
    "measurement": "girdload",
    "unit": "xxx",
    "name": "bts-grid-load-sensor"
}

export let humidity = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic"
    },
    "format": "json",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
    "uri": "http://localhost:3000/",
    "file": "data.csv",
    "measurement": "humidity",
    "unit": "percent",
    "name": "bts-humidity-sensor"
}

export let temperature = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic"
    },
    "format": "json",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
    "uri": "http://localhost:3000/",
    "file": "data.csv",
    "measurement": "temperature",
    "unit": "fahrenheit",
    "name": "bts-temperature-sensor"
}