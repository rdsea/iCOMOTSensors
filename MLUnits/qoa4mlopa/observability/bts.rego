package qoa4ml.bts.alarm 
import data.bts.contract as contract

default contract_violation = false 

contract_violation = true {                         
    count(violation) > 0                            
}

violation[[input.client_info, "Unidentify client"]]{                              
    count(is_stakeholders) == 0          
}

violation[[input.client_info, "Accuracy violation on small resource machine"]]{
    input.service_info.machinetypes == "small"
    input.service_info.metric[_] == "Accuracy"
    some i, j
    contract.quality.mlmodels[i].Accuracy.machinetypes[j] == "small"
    input.metric.Accuracy < contract.quality.mlmodels[i].Accuracy.value
}

violation[[input.client_info, "Accuracy violation on normal resource machine"]]{
    input.service_info.machinetypes == "normal"
    input.service_info.metric[_] == "Accuracy"
    some i, j
    contract.quality.mlmodels[i].Accuracy.machinetypes[j] == "normal"
    input.metric.Accuracy < contract.quality.mlmodels[i].Accuracy.value
}

violation[[input.client_info, "ResponseTime violation on small resource machine"]]{
    input.service_info.machinetypes == "small"
    input.service_info.metric[_] == "ResponseTime"
    some i, j 
    contract.quality.services[i].ResponseTime.machinetypes[j] == "small"
    input.metric.ResponseTime > contract.quality.services[i].ResponseTime.value
}

violation[[input.client_info, "ResponseTime violation on normal resource machine"]]{
    input.service_info.machinetypes == "normal"
    input.service_info.metric[_] == "ResponseTime"
    some i, j
    contract.quality.services[i].ResponseTime.machinetypes[j] == "normal"
    input.metric.ResponseTime > contract.quality.services[i].ResponseTime.value
}

violation[[input.client_info, "Data quality violation"]]{
    input.service_info.metric[_] == "DataAccuracy"
    some i
    contract.quality.data[i].Accuracy.operators == "min"
    input.metric.DataAccuracy < contract.quality.data[i].Accuracy.value
}


is_stakeholders[stakeholders.id]{
    stakeholders := contract.stakeholders[_]
    stakeholders.id == input.client_info.id
    stakeholders.roles == input.client_info.roles
}