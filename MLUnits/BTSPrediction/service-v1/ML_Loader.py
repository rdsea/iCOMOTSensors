import numpy as np
import tflite_runtime.interpreter as tflite
import os, fnmatch

class ML_Loader(object):
    def __init__(self, model_info):
        # Init loader by loading model into the object
        self.model_info = model_info
        if (self.model_info["mlinfrastructure"] == "edge"):
            file_list = os.listdir(model_info["path"])
            pattern = "*.tflite"
            model_file = ""
            for model in file_list:
                if fnmatch.fnmatch(model, pattern):
                    model_file = model
                    break
            self.interpreter = tflite.Interpreter(model_info["path"]+model_file)
            self.interpreter.allocate_tensors()
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()
        elif (self.model_info["mlinfrastructure"] == "cloud"):
            import tensorflow as tf
            self.model = tf.keras.models.load_model(model_info["path"])


    
    def prediction(self,pas_series, batch_size):
        if (self.model_info["mlinfrastructure"] == "edge"):
            result = np.empty([batch_size,pas_series.shape[1],pas_series.shape[2]], dtype=float)
            for i in range(batch_size):
                input_var = np.array(pas_series[i][np.newaxis,:,:], dtype='f')
                self.interpreter.set_tensor(self.input_details[0]['index'], input_var)
                self.interpreter.invoke()
                result[i] = self.interpreter.get_tensor(self.output_details[0]['index']) 
            return result
        elif (self.model_info["mlinfrastructure"] == "cloud"):
            return self.model.predict(pas_series, batch_size=batch_size, verbose=0)
