import argparse
import time
from LSTM_Prediction_Server import LSTM_Prediction_Server


if __name__ == '__main__':
    # Parse the input args
    parser = argparse.ArgumentParser(description="Predict on edge device")
    parser.add_argument('--amqp',help='amqp host', default='localhost')
    args = parser.parse_args()
    # Init the prediction object
    lstm_prediction_server = LSTM_Prediction_Server(args.amqp)
    # Start the queue
    print("============================ BTS prediction is running - Waiting for client ============================")
    lstm_prediction_server.queue.run()

    print("Start Scribing")
    # Waiting loop
    while (flag):
        print("waiting")
        time.sleep(10)