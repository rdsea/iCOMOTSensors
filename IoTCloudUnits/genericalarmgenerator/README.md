# Generic Alarm Data Generator
This is a simple program that can be used to generate alarm data in a generic way. The idea is that there are many types of alarms can occur in open space environment, such as building, seaport, and streets. Normally such alarms are provided by some systems but as we do not have all possible alarm data, we can generate alarm data as input for testing how services are triggered based on such alamrs.

Our goal is to use the alarm generator to create alarms. Based on alarms, some systems must intelligently react by creating different resource slices for triggering data exchange needed for dealing the alarms. It is not our goal to use the alarms to analyze responses (although creating resource slices would aim at providing data and services for alarm responses)

## Common structure
The common structure of an alarm entry should be, in CSV:

time, typeofalarm,alarmseverity,location,typeofobject, objectid,

Such CSV entries can be stored into files or sent to MQTT (or any other queues)


### type of alarms
*  firebreak: fire alarm
*  powerbreak: electricity power breakdown
*  cheminalspill: chemical spill
*  trafficaccident: traffic accident
*  objectfall: objects collapse/falls, e.g., buildings or cranes falls
*  naturaldisaster: some natural disaster happens

etc. the list can be extended. In fact, it is dependent on the application using the generator to decide the list.


### level of alarms/severity
* NOTICE
* WARNING
* CRITICAL

This can be extended

### location
Can be long and lat of GPS

### type of objects
*  container
*  crane
*  vessel
*  truck
*  portterminal
*  warehouse
*  commercial building
*  residentbuilding
*  openspace
*  electricitygrid
*  waterpipeline

### objectid
uuid or known names that one can use to link to other logics

### other fields if required.
We can add other fields if needed.

## Initial input for the Generator
for any study you might have some initial information that can be used for generating data. Such info can be used to guide the generator.

### Example Valencia Port

We use it for examples with a seaport. Information are obtained from http://www.valenciaportpcs.com/en/ , http://www.worldportsource.com/ports/maps/ESP_Port_of_Valencia_1281.php and https://www.valenciaport.com/autoridad-portuaria/infraestructuras/terminales-e-instalaciones/puerto-de-valencia/

Initial information for object:

"portterminalinfo": [
    {
      "name":
      "location":
    }
]

name: "M.S.C. TERMINAL VALENCIA,S.A.U", "EUROLINEAS MARITIMAS S.A.","CIA. TRASMEDITERRANEA, S.A.","NOATUM CONTAINER TMNL.VCIA S.A", "VALENCIA TERMINAL EUROPA, S.A.", "TCV STEVEDORING COMPANY, S.A.","TERMINALES PORTUARIAS, S.L."

location can be long,lat.  we have to look at the map and see. We can also use less accuracy location.

Note: we try to use long and lat for location and use geohash (e.g., ezpb2w9sc) for searching.

"cranesinfo": [
    {
      "name":"",
      "geohash":
    }
]

## Contact
