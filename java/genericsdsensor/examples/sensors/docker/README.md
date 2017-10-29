## Run software-define sensor in docker

To use the Dockerfile, following steps need to be done:

1. Build the sensor source code.
2. Copy the following files into the same folder with the Dockerfile:
  1. src/sdsensor/target/sdsensor-0.0.1-SNAPSHOT-jar-with-dependencies.jar
  2. src/sdsensor/conf/mqttcloud.json (must be edited to match with your MQTT broker)
  3. src/sdsensor/datasample/data.csv (optional: replace with your data file)
3. Run following command:
```
docker build -t yourImageName .
docker run yourImageName
```
4. You can view the data being pushed to the MQTT broker with settings as in mqttcloud.json

Note: The Dockerfile use an Ubuntu image with Java by default to run. If you want to use other images, please make sure java is available.
