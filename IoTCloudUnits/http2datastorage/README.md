# Datastorage Artefact

## Description

artefact that downloads the contents of an URL and uploads them to a Google Cloud Storage Bucket

## Config

* add google service acount keyfile with authorisation to create object in a storage bucket to `./google_storage_key.json`
* set bucketname in config or by calling `PUT /datastorageArtefact/bucketname`(see example below)


## Build

1. `docker build -t datastorage-artefact .`

## Run
`docker run -it --rm -p 8085:8085 datastorage-artefact`

## REST API

Base URL: `http://localhost:8085

| HTTP Method | URL           | Requestbody (JSON)| Description|
|:------------- |:-------------:| :-----:| -----:|
| POST | `/datastorageArtefact/dataurl` | `{"dataurl":<url>}`| loads the content of the dataURL to the Google Cloud Storage Bucket 
| PUT | `/datastorageArtefact/bucketname` |   `{"bucketname":<name>}`| updates the name of the bucket

### cURL Examples
**/dataurl**

```curl --header "Content-Type: application/json" --request POST --data '{"dataurl":"https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"}' http://localhost:8085/datastorageArtefact/dataurl```


**/bucketname**

```curl --header "Content-Type: application/json" --request PUT --data '{"bucketname":"my_new_bucket"}' http://localhost:8085/datastorageArtefact/bucketname```