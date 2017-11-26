# Influx Telegraf

Telegraf is a plugin based metric collection system. It is an open source software as a part of the TICK stack. A sample configuration has been left here so that users can forward logs of the IoT cloud
units in the forms that they want/need.

To activate input/output options simply uncomment the necessary lines in the config file

For further information of telegraf https://github.com/influxdata/telegraf

# Usage
Telegraf can either be installed on your machine or used in a docker container

A simple way to use telegraf is to start a docker instance and mount the required telegraf.conf file along with any volumes that might contain log files to read. An example execution:

`$ docker run -v $PWD/telegraf.conf:/etc/telegraf/telegraf.conf:ro -v /tmp:/tmp telegraf`

The above command will start telegraf with the telegraf.conf file located in the current directory. It will also mount /tmp into the docker container, this could be useful if you want to read log files in the /tmp directory of your machine.

We reccommend you to read about telegraf's different plugins. Most common use cases for log reporting can be solved by one of its plugins
