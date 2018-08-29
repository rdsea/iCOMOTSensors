# TruckMonitoring Service

Trucks are entered and exited gates of a seaport. IoT devices and sensors can detect the trucks.

In this service, we receive events about trucks entering and exiting the port and we maintain a list of trucks inside the port.

Using this list, one can determine some control actions, such as

* turn on lights
* send warning to trucks when something is wrong.
* sharing the information to authority when needed.

## Services

It is just a simple example: we just keep the list of the trucks in the seaport and few types of information about the truck.

## Integration scenarios

A consumer, such as police, needs to monitor/access information of trucks entering and leaving, the consumer requests a specific instance running for them.

## Data

For testing purpose, we use sample data from Valencia seaport in Inter-IoT. The data is not published here. We will see if we can share any useful information for testing.

## Configuration

### Configuration the service

The service needs MongoDB as a back-end database:

$export MONGODB_URL=mongodb://localhost:27017/truckmonitoring

### Configuration of truck information queue

Truck enter and exit events will be sent through AMQP RabbitMQ. This should be defined in the configuration at runtime.

## APIs

The following API can be used to get information about trucks:

* GET /list  return all trucks in the port.
* GET /list/:trucklicense return if the truck with the license in the port.


## Authors

* Hong-Linh Truong
