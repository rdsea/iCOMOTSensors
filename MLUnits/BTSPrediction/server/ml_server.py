import argparse
import time
from ML_Prediction_Server import ML_Prediction_Server


if __name__ == '__main__':
    # Parse the input args
    parser = argparse.ArgumentParser(description="Predict on edge device")
    parser.add_argument('--amqp',help='amqp host', default='localhost')
    args = parser.parse_args()
    # Init the prediction object
    ml_prediction_server = ML_Prediction_Server(args.amqp)
    # Start the queue
    print("============================ BTS prediction is running - Waiting for client ============================")
    ml_prediction_server.queue.run()

    print("Start Scribing")
    # Waiting loop
    while (flag):
        print("waiting")
        time.sleep(10)