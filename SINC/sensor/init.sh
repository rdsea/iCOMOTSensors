gcloud container clusters create test --num-nodes=3
kubectl run broker --image=eclipse-mosquitto --port=1883
kubectl expose deployment broker --port=1883 --target-port=1883 --type=LoadBalancer