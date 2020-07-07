#  BTS Ingestion Provider

## Overview
This provider provisions ingestion services. Each ingestion service is a unit that can be provisioned as a container.

## Setup

This provider expects a URL specifying a mongodb database for storing client information. Furthermore, a 'keyfile.json' for accessing BigQuery is required. This provider also needs kubernetest

## Run the provider 

`$ npm start` will start the provider


## Update
- Refactor to work with node v14 and new version of related services
