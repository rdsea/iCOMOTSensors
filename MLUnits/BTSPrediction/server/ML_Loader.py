import numpy as np
import tflite_runtime.interpreter as tflite

class ML_Loader(object):
    def __init__(self, model_info):
        # Init loader by loading model into the object
        self.interpreter = tflite.Interpreter(model_info["path"])
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

    
    def prediction(self,pas_series):
        # return self.LSTM_model.predict(pas_series, batch_size=1, verbose=0)
        input_var = np.array(pas_series, dtype='f')
        self.interpreter.set_tensor(self.input_details[0]['index'], input_var)
        self.interpreter.invoke()
        y = self.interpreter.get_tensor(self.output_details[0]['index']) 
        return y
