## Run software-define sensor in TOSCA-based deployment tool (SALSA)

This example includes 3 TOSCA files which can be deployed by [SALSA](http://tuwiendsg.github.io/SALSA/). The TOSCA files define the sensor runtime in 3 cases: plain machine, via Docker, and via Vagrant.

The steps to run these examples are:

1. Build the sensor source code.
2. Install and run SALSA.
3. Copy and pack following files into a single package: sensor-artifacts.tar.gz
  1. src/sdsensor/target/sdsensor-0.0.1-SNAPSHOT-jar-with-dependencies.jar
  2. src/sdcommon/target/sdcommon-0.0.1-SNAPSHOT.jar
  3. src/sdcloudconnectivity/target/cloud-connectivity-0.0.1-SNAPSHOT-jar-with-dependencies.jar
  4. src/sdsensor/conf/mqttcloud.json (must be edited to match with your MQTT broker)
  5. src/sdsensor/datasample/data.csv (optional: replace with your data file)
4. Copy execution file: runsensor.sh
5. Copy Dockerfile or Vagrantfile in the corresponding case.
4. Edit the path in ```ArtifactReference``` in TOSCA files to match with above artifacts.
5. Submit the TOSCA file to SALSA and wait for the provisioning completed.

You can view the data being pushed to the MQTT broker with settings as in mqttcloud.json

Note: In this example, we pack multiple artifacts for a better deliver.
