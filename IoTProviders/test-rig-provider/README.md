# Test Rig provider
This REST server provides an API to provision instances of Test Rig for your slice ID

# Usage

`GET /testrig`
    - provides a sample configuration to provision the test rig

`POST /testrig`
    - creates a test rig with the configuration provided from the GET call

`GET /testrig/:sliceId`
    - returns all the test rigs associated with the slice id provided

`DELETE /testrig/:testrigId`
    - deletes the testrig with the provided id

# Deployment

This server must be deployed somewhere with access to `gcloud` and `kubectl`. Easiest is a google compute VM which has these
components installed