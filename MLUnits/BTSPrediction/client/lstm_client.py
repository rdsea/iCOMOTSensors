import time
import argparse
from LSTM_Prediction_Client import LSTM_Prediction_Client

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Sent request to Rabbit broker")
    parser.add_argument('--file', default="../data/1161114002_122_norm.csv")
    parser.add_argument('--clientid',help='client id', default=1)
    parser.add_argument('--amqp',help='amqp host', default='localhost')
    args = parser.parse_args()

    # prometheus_client.start_http_server(int(args.prometheus))
    # Define a client for publising data

    lstm_predition_client = LSTM_Prediction_Client(args.amqp)
    while (1):
        lstm_predition_client.publish_message(args.file)
    time.sleep(1)