import numpy as np
import tflite_runtime.interpreter as tflite

class ML_Loader(object):
    def __init__(self):
        # Init loader by loading model into the object
        self.interpreter_single_var_LR = tflite.Interpreter("../models/single_var_LR/single_var_LR.tflite")
        self.interpreter_single_var_LR.allocate_tensors()
        self.input_details_single_var_LR = interpreter_single_var_LR.get_input_details()
        self.output_details_single_var_LR = interpreter_single_var_LR.get_output_details()

        self.interpreter_multi_var_LR = tflite.Interpreter("../models/multi_var_LR/multi_var_LR.tflite")
        self.interpreter_multi_var_LR.allocate_tensors()
        self.input_details_multi_var_LR = interpreter_multi_var_LR.get_input_details()
        self.output_details_multi_var_LR = interpreter_multi_var_LR.get_output_details()

        self.interpreter_DNN_single_regression = tflite.Interpreter("../models/DNN_single_regression/DNN_single_regression.tflite")
        self.interpreter_DNN_single_regression.allocate_tensors()
        self.input_details_DNN_single_regression = interpreter_DNN_single_regression.get_input_details()
        self.output_details_DNN_single_regression = interpreter_DNN_single_regression.get_output_details()

        self.interpreter_DNN_multi_regression = tflite.Interpreter("../models/DNN_multi_regression/DNN_multi_regression.tflite")
        self.interpreter_DNN_multi_regression.allocate_tensors()
        self.input_details_DNN_multi_regression = interpreter_DNN_multi_regression.get_input_details()
        self.output_details_DNN_multi_regression = interpreter_DNN_multi_regression.get_output_details()

    def single_var_LR(self, index):
        # Prediction using Single variable Linear Regression
        input_var = np.array([index], dtype='f')
        interpreter_single_var_LR.set_tensor(input_details_single_var_LR[0]['index'], input_var)
        interpreter_single_var_LR.invoke()
        y = interpreter_single_var_LR.get_tensor(output_details_single_var_LR[0]['index']) 
        return y

    def multi_var_LR(self, indext, value, thresdhold):
        # Prediction using Multi variable Linear Regression
        input_var = np.array([[indext, value, thresdhold]], dtype='f')
        interpreter_multi_var_LR.set_tensor(input_details_multi_var_LR[0]['index'], input_var)
        interpreter_multi_var_LR.invoke()
        y = interpreter_multi_var_LR.get_tensor(output_details_multi_var_LR[0]['index']) 
        return y

    def DNN_single_regression(self, index):
        # Prediction using Single variable DNN Regression
        input_var = np.array([index], dtype='f')
        interpreter_DNN_single_regression.set_tensor(input_details_DNN_single_regression[0]['index'], input_var)
        interpreter_DNN_single_regression.invoke()
        y = interpreter_DNN_single_regression.get_tensor(output_details_DNN_single_regression[0]['index']) 
        return y
    
    def DNN_multi_regression(self, indext, value, thresdhold):
        # Prediction using Multi variable DNN Regression
        input_var = np.array([[indext, value, thresdhold]], dtype='f')
        interpreter_DNN_multi_regression.set_tensor(input_details_DNN_multi_regression[0]['index'], input_var)
        interpreter_DNN_multi_regression.invoke()
        y = interpreter_DNN_multi_regression.get_tensor(output_details_DNN_multi_regression[0]['index']) 
        return y