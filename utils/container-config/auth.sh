gcloud auth activate-service-account --key-file=/keyfile.json --project=iotcloudexamples
gcloud -q config set compute/zone europe-west1-b &&
gcloud -q container clusters get-credentials iotcloudexamples
