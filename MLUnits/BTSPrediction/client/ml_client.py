import time
import argparse
from ML_Prediction_Client import ML_Prediction_Client


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Sent request to Rabbit broker")
    parser.add_argument('--stationid', default=1160629000)
    parser.add_argument('--datapointid', default=121)
    parser.add_argument('--alarmid', default=308)
    parser.add_argument('--file', default="../data/1160629000_121_308_test.csv")
    parser.add_argument('--clientid',help='client id', default=1)
    parser.add_argument('--amqp',help='amqp host', default='localhost')
    args = parser.parse_args()

    # prometheus_client.start_http_server(int(args.prometheus))
    # Define a client for publising data

    ml_predition_client = ML_Prediction_Client(args.amqp)
 
    ml_predition_client.publish_message(args.file)
    time.sleep(1)