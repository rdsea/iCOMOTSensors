from flask import Flask, request
from LSTM_Prediction_Server import LSTM_Prediction_Server
import time

app = Flask(__name__)

service_dict = {}
# homepage
@app.route('/')
def hello():
    return "This is BTS Server"

# create service frome json file using REST 
@app.route('/create_service', methods=['POST'])
def create_service():
    req_data = request.get_json()
    if req_data["client_info"] != None:
        pass
    if req_data["service_info"] != None:
        pass
    if req_data["broker_service"] != None:
        pass
    if req_data["model"] != None:
        model = req_data["model"]
        if model["name"] == "LSTM":
            broker_info = req_data["broker_service"]
            queue_info = req_data["queue_info"]
            new_service = LSTM_Prediction_Server(model, broker_info, queue_info)
            service_dict["LSTM"] = new_service
            new_service.start()
        pass
    return "the data is {}".format(req_data)

# REST commands
@app.route('/command', methods=['POST'])
def execute_command():
    req_data = request.get_json()
    if req_data["client_info"] != None:
        pass
    if req_data["model"] != None:
        model_name = req_data["model"]["name"]
        if service_dict[model_name] != None:
            req_service = service_dict[model_name]
            if req_data["command"] != None:
                command = req_data["command"]
                if command == "START":
                    req_service.start()
                if command == "STOP":
                    req_service.stop()
        pass
    return "the data is {}".format(req_data)

if __name__ == '__main__':
    app.run(debug=True)