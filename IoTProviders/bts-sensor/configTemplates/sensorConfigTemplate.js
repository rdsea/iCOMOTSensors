export let batteryCurrent = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic1"
    },
    "format": "json",
    "uri": "http://localhost:1883/",
    "file": "data.csv",
    "measurement": "current",
    "unit": "ampere",
}

export let batteryVoltage = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic1"
    },
    "format": "json",
    "uri": "http://localhost:1883/",
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
    "format": "json",
    "uri": "http://localhost:1883/",
    "file": "data.csv",
    "measurement": "capacitance",
    "unit": "farad",
    "name": "bts-capacity-sensor"
}

export let generatorVoltage = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic"
    },
    "format": "json",
    "uri": "http://localhost:1883/",
    "file": "data.csv",
    "measurement": "voltage",
    "unit": "volt",
    "name": "bts-generator-voltage-sensor"
}

export let gridload = {
    "protocol": "mqtt",
    "protocolOptions": {
        "topic": "topic"
    },
    "format": "json",
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
    "uri": "http://localhost:3000/",
    "file": "data.csv",
    "measurement": "temperature",
    "unit": "fahrenheit",
    "name": "bts-temperature-sensor"
}