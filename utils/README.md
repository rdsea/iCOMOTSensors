# Some utilities

We have some utilities for testing purposes. Both JavaScript and Python code are included.
* requirements.txt for python package
* package.json for JavaScript 

Conversion programs are used to convert real data from one form to another form for data preparation for tests

* valenciaport-data-json-csv.py : convert json data to csv

Generator programs are used to generate fake data (e.g. based on realistic model) in cases we do not have enough data for tests:

* valenciaport-data-emissionCabins-generator.js: as one example for generating data for testing

You can also generate fake data in json and then convert to csv.


$node valenciaport-data-emissionCabins-generator.js >aa.json

$python3 valenciaport-data-json-csv.py --input_json_file aa.json --output_csv_file aa.csv --name_typeofdata emissionCabins
