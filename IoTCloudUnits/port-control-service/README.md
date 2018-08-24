# Port Control service

This service emulates a seaport control service (based on the Valencia port). The Port Control Service manages various entities (lights, terminals, etc.) and interfaces to various other providers (e.g., vessel management service, truck companies, crane companies, etc)

## setup

This service should be running with only one instance (for testing purpose). If you want to run multiple instance for fault tolerance and performance, you can put serveral instances of the service behind a API Getway, such as Kong

## TODO
Add cranes, etc.
