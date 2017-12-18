from openjdk:8-jdk-alpine

RUN apk update && apk add maven

COPY . /sensor
WORKDIR /sensor/src/sdcommon
RUN mvn clean && mvn install
WORKDIR /sensor/src/sdcloudconnectivity
RUN mvn clean && mvn install
WORKDIR /sensor/src/log4jmqtt
RUN mvn clean && mvn install

WORKDIR /sensor/src/sdsensor
RUN mvn clean && mvn install

WORKDIR /sensor
RUN cp /sensor/src/sdsensor/target/sdsensor-0.0.1-SNAPSHOT-jar-with-dependencies.jar .

CMD ["java", "-jar", "sdsensor-0.0.1-SNAPSHOT-jar-with-dependencies.jar", "config.json", "data.csv", "test"]
