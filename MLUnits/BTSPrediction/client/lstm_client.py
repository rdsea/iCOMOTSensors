import time
import argparse
from LSTM_Prediction_Client import LSTM_Prediction_Client
import json



if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Sent request to Rabbit broker")
    parser.add_argument('--file', default="../data/1161114002_122_norm.csv")
    parser.add_argument('--clientInfo',help='client information file', default="./client.json")
    args = parser.parse_args()

    # Define a client for publising data
    with open(args.clientInfo, "r") as f:
        client_info = json.load(f)
    lstm_predition_client = LSTM_Prediction_Client(client_info)
    lstm_predition_client.start()
    while (1):
        lstm_predition_client.publish_message(args.file)
    time.sleep(1)