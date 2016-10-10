#/bin/bash
# This script give the example of how use SensorGatewayUtil.sh with the existing data set to generate GPS sensors.
# The output of the utility consists of artifacts for building sensor topology, deploying and running sensors.
# Please check the "sensors-distribution" folder to see the example of output.
# Quick notes:
#   -p mqtt: the sensor send data via MQTT
#   -s condenser_rule.csv: the data set in CSV
#   -c 2: the sensor data, which is a set of collumns in the data set
#   -n motor_status: the name of the sensor
# Please run "SensorGatewayUtil.sh -h" for see more options

cp ../../../bin/SensorGatewayUtil.sh .

bash SensorGatewayUtil.sh sensor -p mqtt -s gps1279.csv -c 2,3 -n location
bash SensorGatewayUtil.sh sensor -p mqtt -s gps1279.csv -c 4 -n speed

rm SensorGatewayUtil.sh
