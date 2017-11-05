package cloudBrokers.ConsumerThreads;

import org.apache.kafka.clients.consumer.*;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import java.util.Arrays;
import java.util.Properties;

public class KafkaConsumerThread implements Runnable{
    private Consumer<String, String> consumer;
    private MqttAsyncClient mqtt;

    private boolean running;
    private Thread t;
    private String threadName;

    public KafkaConsumerThread(Properties props, MqttAsyncClient mqtt, String[] topics,String name){
        this.running = false;
        this.mqtt = mqtt;
        this.consumer = new KafkaConsumer<String, String>(props);
        this.consumer.subscribe(Arrays.asList(topics));
        this.threadName = name;
    }

    public void run() {
        this.running = true;
        int count = 0;
        while(running){
            ConsumerRecords<String, String> consumerRecords = this.consumer.poll(100);
            for(ConsumerRecord<String, String> consumerRecord : consumerRecords){
                MqttMessage message = new MqttMessage(consumerRecord.value().getBytes());
                try {
                    mqtt.publish(consumerRecord.topic(),message);
                } catch (MqttException e) {
                    e.printStackTrace();
                }

            }
            this.consumer.commitSync();
        }
    }

    public void start(){
        if(t == null){
            t = new Thread(this, this.threadName);
            t.start();
        }
    }

    public void stop(){
        if(t == null) return;

        try {
            this.running = false;
            t.join();
            System.out.println("kafka consumer stopped");
        } catch (InterruptedException e) {
            System.out.println("error stopping kafka consumer");
            e.printStackTrace();
        }
    }
}
