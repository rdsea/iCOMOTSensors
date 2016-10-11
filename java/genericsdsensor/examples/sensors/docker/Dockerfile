from leduchung/ubuntu:14.04-jre8

RUN mkdir -p /tmp/sensor

ADD cloud-connectivity-0.0.1-SNAPSHOT-jar-with-dependencies.jar /tmp/sensor/cloud-connectivity-0.0.1-SNAPSHOT-jar-with-dependencies.jar
ADD sdcommon-0.0.1-SNAPSHOT.jar /tmp/sensor/sdcommon-0.0.1-SNAPSHOT.jar
ADD sdsensor-0.0.1-SNAPSHOT-jar-with-dependencies.jar /tmp/sensor/sdsensor-0.0.1-SNAPSHOT-jar-with-dependencies.jar

ADD data.csv /tmp/sensor/data.csv
ADD mqttcloud.json /tmp/sensor/mqttcloud.json
ADD runsensor.sh /tmp/sensor/runsensor.sh

WORKDIR /tmp/sensor

CMD ["/bin/sh", "./runsensor.sh"]
