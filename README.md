
# IoT Cloud Samples for Ensembles of IoT, Network Functions and Cloud

## Introduction
This collection includes different types of IoT, network functions and cloud units, as well as samples of IoT Cloud Systems, data, and testing scenarios for different purposes. The work is partially supported by the [H2020 U-test project](http://www.u-test.eu) and the [H2020 Inter-IoT](http://www.inter-iot-project.eu/), with a lot of in-kind effort from students and also is benefited from our collaboration with industries, who share use cases and data.

Our goal  is to provide open source samples that one can use for different purposes in research and development of [ensembles of IoT, Network functions and clouds](https://link.springer.com/article/10.1007/s11761-018-0228-2).

Our code is currently being updated and uploaded.
Contact Hong-Linh Truong (hong-linh.truong@tuwien.ac.at) for further information

## IoT Cloud Units

They include units for IoT and Cloud. The code is under IoTCloudUnits directory.

### IoT Units
IoT units are components for IoT. Examples are sensors, actuators, and even gateways. They can also be just user-defined scripts that model some IoT behaviors.


#### Sensors

See genericsdsensor  and simplesensor. They are used for:

- emulated sensors and real sensors
- sensors using Things-specific APIs to monitor Things
- sensors using Software-defined Gateways API to monitor Things
- sensors using different cloud connectivity types to send data to Cloud/Gateways
- sensors running in different environments (bare OS, docker, vagrant, etc.)
- sensors running in a single node (emulated or real)
- sensors running within a topology (creating a network of sensors)

We also have complex IoT providers, such as camera provider in IoTCameraDataProvider:

- provide a service through which one can obtain real public camera video.

#### IoT Data Transformation and ingest units

They are for processing, transforming and ingesting data,
for example from CVS to JSON (see csvToJson), ingestionClient, mqttbridge, etc.

#### IoT control

they are for testing controlling features in IoT. For example, the testRig is used to emulate a real testRig which can be used to obtain and control sensors.

### Cloud Units

Most Cloud units are based on real cloud services, such as from Google, Amazon, Azure. However, we build some wrappers to them for illustrating our concepts. Furthermore we also build some cloud services for specific purposes.

### Network functions units

They are for network function features. For example, firewall control is network feature that can be deployed for a specific system.

## IoT, Cloud and Network function providers

Units provide basic functions. We provide Providers which can be used to provision and manage resources, which are instances of units, for different purposes. A provider will provide IoT, network functions and cloud resources.

Examples:
- BTS Sensor Provider
- MQTT Provider
- NODE-RED Provider
- Firewall Provider

There are specific code for specific providers but there are also generic code for generic providers that can be adapted easy for other purposes.

## Data
We provide some sample of data collected from real systems. Examples are BTS data. from monitoring real BTS

## Scenarios Examples

From units, providers and data, for research questions, one can create various different scenarios. Each scenario describes a system to be designed and it might be used for different purposes. We provide some scenarios but other works are also using our stuffs for research, such as:

- for interoperability and slice management (https://github.com/SINCConcept/HINC)
- for testing uncertainty (https://github.com/rdsea/T4UME)
- for testing incidents (https://github.com/rdsea/bigdataincidentanalytics)

## Relevant publications

If you use the samples, try to read the following papers and cite them where we describe samples:

- Hong-Linh Truong, Luca Berardinelli, Ivan Pavkovic and Georgiana Copil, Modeling and Provisioning IoT Cloud Systems for Testing Uncertainties, [Pre-print PDF](http://www.infosys.tuwien.ac.at/staff/truong/publications/2017/truong-mobiquitous2017.pdf), 14th EAI International Conference on Mobile and Ubiquitous Systems: Computing, Networking and Services (MobiQuitous 2017), November 7–10, 2017,Melbourne, Australia.
- Hong-Linh Truong, Georgiana Copil, Schahram Dustdar, Duc-Hung Le, Daniel Moldovan, Stefan Nastic, On Engineering Analytics for Elastic IoT Cloud Platforms [PDF] (http://www.infosys.tuwien.ac.at/staff/truong/publications/2016/truong-icsoc2016.pdf), (c)Springer-Verlag,14th International Conference on Service Oriented Computing (ICSOC 2016), Oct 10-13, 2016. Banff, Canada.
 -  

## Contact
Code is currently updated and uploaded.
Contact Hong-Linh Truong (hong-linh.truong@tuwien.ac.at) for further information
