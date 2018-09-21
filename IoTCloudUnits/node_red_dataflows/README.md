# Overview
This directory includes several node-red flows that can act as software artefacts to solve interoperability problems. To use them for rsiHub's interoperability features, a corresponding interoperability metadata file must be available.

For specific information on each of the flows please view their detailed README

## How to register a flow in the artefact service

run `pizza artefact create <software-artefact> <execution-environment> <metadata-file> <name>`

where:

|`<variable>`| description | example |
|:--- |:--- | :---|
| `<software-artefact>` | either url of a software artefact or a file. if it is a file, then the file will be uploaded to google storage | for examples see flow_*.json files of https://github.com/rdsea/IoTCloudSamples/tree/master/IoTCloudUnits/node_red_dataflows |
| `<execution-environment>` | the environment that the artefact runs in. currently supported is **nodered** . check updates if any other are already supported | nodered|
| `<metadata-file>` | a file that contains the interoperability metadata of the software artefact | for examples see metadata_*.json files of https://github.com/rdsea/IoTCloudSamples/tree/master/IoTCloudUnits/node_red_dataflows |
| `<name>` | the name of the artefact | nodered_csv_to_json|