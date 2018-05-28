FROM google/cloud-sdk:latest

COPY ./keyfile.json ./keyfile.json
RUN curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get --assume-yes install nodejs

RUN gcloud auth activate-service-account --key-file=/keyfile.json --project=iotcloudexamples && \
    gcloud -q config set compute/zone europe-west1-b && \
    gcloud -q container clusters get-credentials iotcloudexamples

RUN echo 'gcloud auth activate-service-account --key-file=/keyfile.json --project=iotcloudexamples' >> auth.sh && \
    echo 'gcloud -q config set compute/zone europe-west1-b &&' >> auth.sh && \
    echo 'gcloud -q container clusters get-credentials iotcloudexamples' >> auth.sh 

RUN chmod +x auth.sh

