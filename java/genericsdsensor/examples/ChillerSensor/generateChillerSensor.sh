#/bin/bash
# This script give the example of how use SensorGatewayUtil.sh with the existing data set to generate sensors.
# The output of the utility consists of artifacts for building sensor topology, deploying and running sensors.
# Please check the "sensors-distribution" folder to see the example of output.
# Quick notes:
#   -p mqtt: the sensor send data via MQTT
#   -s condenser_rule.csv: the data set in CSV
#   -c 1,2: the sensor data, which is a set of collumns in the data set
#   -n motor_status: the name of the sensor
# Please run "SensorGatewayUtil.sh -h" for see more options

cp ../../../bin/SensorGatewayUtil.sh .

bash SensorGatewayUtil.sh sensor -p mqtt -s condenser_rule.csv -c 1,4 -n difference_oat_and_con_temp
bash SensorGatewayUtil.sh sensor -p mqtt -s condenser_rule.csv -c 1,3 -n motor_status 
bash SensorGatewayUtil.sh sensor -p mqtt -s condenser_rule.csv -c 1,2 -n oat


bash SensorGatewayUtil.sh sensor -p mqtt -s evaporator_fouling.csv -c 1,5 -n ch2a_exv_position 
bash SensorGatewayUtil.sh sensor -p mqtt -s evaporator_fouling.csv -c 1,4 -n chw_supply_temp
bash SensorGatewayUtil.sh sensor -p mqtt -s evaporator_fouling.csv -c 1,3 -n fcu_ff1_set_point
bash SensorGatewayUtil.sh sensor -p mqtt -s evaporator_fouling.csv -c 1,2 -n fcu_ff1_space_temp

bash SensorGatewayUtil.sh sensor -p mqtt -s low_suction_pressure_ch3.csv -c 1,6 -n cmn_chws_temp
bash SensorGatewayUtil.sh sensor -p mqtt -s low_suction_pressure_ch3.csv -c 1,5 -n ch3_cktA_compressor_suction_superheat_temp
bash SensorGatewayUtil.sh sensor -p mqtt -s low_suction_pressure_ch3.csv -c 1,4 -n ch3_cktA_percent_total_capacity
bash SensorGatewayUtil.sh sensor -p mqtt -s low_suction_pressure_ch3.csv -c 1,3 -n ch3_cktA_exv_position
bash SensorGatewayUtil.sh sensor -p mqtt -s low_suction_pressure_ch3.csv -c 1,2 -n ch3_cktA_suction_pressure

rm SensorGatewayUtil.sh
