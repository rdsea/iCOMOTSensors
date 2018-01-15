## Run software-define sensor via Vagrant

Vagrant enables to deploy sensor on top of different providers. This example contains two Vagrant files: for VirtualBox and for docker. VirtualBox is the default environment.

To use the Vagrant, following steps need to be done:

1. Install Vagrant by following [the documentation](https://www.vagrantup.com/docs/installation/).
2. Build the sensor source code.
3. Copy the all following sensor artifacts into the same folder with the Vagrant file:
  1. src/sdsensor/target/sdsensor-0.0.1-SNAPSHOT-jar-with-dependencies.jar
  2. src/sdcommon/target/sdcommon-0.0.1-SNAPSHOT.jar
  3. src/sdcloudconnectivity/target/cloud-connectivity-0.0.1-SNAPSHOT-jar-with-dependencies.jar
  4. src/sdsensor/conf/mqttcloud.json (must be edited to match with your MQTT broker)
  5. src/sdsensor/datasample/data.csv (optional: replace with your data file)
4. Based on which environment to run:
  1. Vagrant + Virtualbox: change `Vagrantfile.virtualbox` to `Vagrantfile`  
  2. Vagrant + Docker: change `Vagrantfile.docker` to `Vagrantfile`, and copy the Dockerfile from docker example to this folder
3. Run following command:
```
vagrant up
```
4. You can view the data being pushed to the MQTT broker with settings as in mqttcloud.json

Note: 

* In the case of Vagrant + Virtualbox, you need virtuabox installed localy. The image to be used in this case is Ubuntu 12.04, which has no Java. Thus, Vagrant will install JRE 1.7 during the provisioning.
* In the case of Vagrant + Docker, the result is similar to Docker example with Vagrant API to control the Docker container.
