# Data plugins
This folder should hold all the data services that the ingestion client needs.

## Interface
Each data plugin should implement the methods `Promise init(config)` and `Promise insert(topic, data)`. Whatever additional libraries/api clients or helper functions that need to be used is left to the discretion of the developer. However, if more exposed methods are needed please document any changes in this README.

NOTE: both of the methods above need to return es6 Promise. Make sure that you use promised-based libraries or promisify any library functions that you will use with the help of the node `util` package's `promisify` function.