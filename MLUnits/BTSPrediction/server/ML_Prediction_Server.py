import argparse
import time
import json
import pika
from ML_Loader import ML_Loader
from Queue_Handler import Queue_Handler


flag = True

class ML_Prediction_Server(object):
    def __init__(self):
        # Init the queue for ML request and load the ML model
        self.queue = Queue_Handler(self)
        self.loader = ML_Loader()

    
    def ML_prediction(self, index, value, threshold):
        # Making prediciton using loader
        svlr = self.loader.single_var_LR(index)
        mvlr = self.loader.multi_var_LR(index, value, threshold)
        dnnsr = self.loader.DNN_single_regression(index)
        dnnmr = self.loader.DNN_multi_regression(index, value, threshold)

        # Load the result into json format
        data_js = {
            "SVLR": float(svlr), 
            "MVLR": float(mvlr), 
            "DNNSR": float(dnnsr), 
            "DNNMR": float(dnnmr)
        }
        print("Result: {}".format(data_js))
        return json.dumps(data_js)

if __name__ == '__main__':
    # Parse the input args
    parser = argparse.ArgumentParser(description="Predict on edge device")
    # Init the prediction object
    ml_prediction_server = ML_Prediction_Server()
    # Start the queue
    ml_prediction_server.queue.run()

    print("Start Scribing")
    # Waiting loop
    while (flag):
        print("waiting")
        time.sleep(10)