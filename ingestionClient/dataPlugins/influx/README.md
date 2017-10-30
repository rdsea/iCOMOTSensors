# Influxdb
A running influxdb instance must be provided in the configuration. To run one on your local machine you canuse docker 

`$ docker run -p 8086:8086 -v influxdb:/var/lib/influxdb influxdb`.

Follow the sample in `config.sample.yml` and create your own `config.yml`. 