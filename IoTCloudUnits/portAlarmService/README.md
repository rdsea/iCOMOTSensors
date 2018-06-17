# Port Alarm Service
This service emulates an alarm service in the port. The service listens the alarms sent through a queue, and query vessels approaching the port and sends requests to the vessels.
Similar actions can be done for other entities in the seaport like: trucks and cranes.

## configuration

- mqtt

## Simple scenario

In a simple scenario, we can create one broker for all vessels and send information to the vessels.

## Complex scenario

for complex scenarios, we could deploy one broker for all vessels but each vessel would have different data types and formats. Thus, we need to deploy different data transformation for different vessels.

Another complex scenario is if a vessel needs a different transport protocol, then a bridge should also deploy.

## Authors

* Lingfan Gao
* Hong-Linh Truong
