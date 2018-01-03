# How to build a working sensor jar
What is imporant from this module is that a working jar file (the sensor) is created. Follow these steps
1. in sdcommon `$ mvn install`
2. in sdcloudconnectivity `$ mvn install`
3. in sdsensor `$ mvn package`
<<<<<<< HEAD
=======
4. install the log4jmqtt package in this repository with `$ mvn install`
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32

The resulting file will be `sdsensor-0.0.1-SNAPSHOT-jar-with-dependencies.jar` and will contain all dependencies necessary. The first two builds are necessary to make sure the dependencies are installed to the local repository, /lib binaries will no longer have to be included in the repo.

If you are developing on sdsesor, make sure to run the first two steps to make sure your ide can pick up the dependencies.

<<<<<<< HEAD
PLEASE udpate this file if the build process changes for sake of future developers
=======
PLEASE udpate this file if the build process changes for sake of future developers
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
