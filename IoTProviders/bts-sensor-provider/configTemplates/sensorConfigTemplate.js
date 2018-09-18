export let batterycurrent = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic1",
        "username": "xxx",
        "password": "xxx",
    },
    "format": "json",
    "uri": "http://localhost:1883/",
    "file": "data.csv",
    "measurement": "current",
    "unit": "ampere",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
}

export let batteryvoltage = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic1",
        "username": "xxx",
        "password": "xxx",
    },
    "format": "json",
    "uri": "http://localhost:1883/",
    "file": "data.csv",
    "measurement": "voltage",
    "unit": "volt",
    "name": "bts-battery-voltage-sensor",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
}

export let capacity = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic",
        "username": "xxx",
        "password": "xxx",
    },
    "format": "json",
    "uri": "http://localhost:1883/",
    "file": "data.csv",
    "measurement": "capacitance",
    "unit": "farad",
    "name": "bts-capacity-sensor",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
}

export let generatorvoltage = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic",
        "username": "xxx",
        "password": "xxx",
    },
    "format": "json",
    "uri": "http://localhost:1883/",
    "file": "data.csv",
    "measurement": "voltage",
    "unit": "volt",
    "name": "bts-generator-voltage-sensor",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
}

export let gridload = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic",
        "username": "xxx",
        "password": "xxx",
    },
    "format": "json",
    "uri": "http://localhost:3000/",
    "file": "data.csv",
    "measurement": "girdload",
    "unit": "xxx",
    "name": "bts-grid-load-sensor",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
}

export let humidity = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic",
        "username": "xxx",
        "password": "xxx",
    },
    "format": "json",
    "uri": "http://localhost:3000/",
    "file": "data.csv",
    "measurement": "humidity",
    "unit": "percent",
    "name": "bts-humidity-sensor",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
}

export let temperature = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic",
        "username": "xxx",
        "password": "xxx",
    },
    "format": "json",
    "uri": "http://localhost:3000/",
    "file": "data.csv",
    "measurement": "temperature",
    "unit": "celsius",
    "name": "bts-temperature-sensor",
    "fields": [
        "id",
        "reading_time",
        "value",
        "station_id",
        "parameter_id"
    ],
}
