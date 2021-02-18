import argparse
import time
import json
import pika
import requests
import prometheus_client

flag = True
headers = {
        'Content-Type': 'application/json'
    }
prom_monitor = prometheus_client.Gauge('service_quality',
                                       'The quality of current ML service',
                                       ['resource_type'])

def on_request(ch, method, props, body):
    global count
    qoa_report = json.loads(str(body.decode("utf-8")))

    try:
        response = requests.request("POST", qoa_report["url"], headers=headers, data = body)
        ch.basic_publish(exchange='',
                        routing_key=props.reply_to,
                        properties=pika.BasicProperties(correlation_id = \
                                                            props.correlation_id),
                        body=str(response))
        ch.basic_ack(delivery_tag=method.delivery_tag)  
    except Exception as e:
        return "Fail to send the report from {} to {}, at {}. Details: {}".format(qoa_report, qoa_report["url"], time.time(), e)
    violation = json.loads(response.text.encode('utf8'))["result"]
    print(violation)
    with open("./result.csv", 'a+') as f:
        f.write("{},{}\n".format(time.time(),violation))

    for item in qoa_report["input"]["metric"]:
        key = "{}_{}".format(item,qoa_report["input"]["client_info"]["id"])
        value = float(qoa_report["input"]["metric"][item])
        print (key)
        print (value)
        send_metric_prom(prom_monitor, key, value)
    try:
        return json.loads(response.text.encode('utf8'))["result"]
    except Exception as e:
        return "Fail to load the response {} as a json, at {}. Details: {}".format(response, time.time(), e)
    
def send_metric_prom(prometheus_var, key, value):
    prometheus_var.labels(key).set(value)
    

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Predict on edge device")
    parser.add_argument('--prometheus',help='prometheus port', default=9098)

    args = parser.parse_args()
    prometheus_client.start_http_server(int(args.prometheus))
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    channel.exchange_declare(exchange='topic_qoa', exchange_type='topic')

    result = channel.queue_declare('qoa_queue', exclusive=True)
    queue_name = result.method.queue

    channel.queue_bind(exchange='topic_qoa', queue=queue_name, routing_key="report")

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='qoa_queue', on_message_callback=on_request)
    channel.start_consuming()


    