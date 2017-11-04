package cloudBrokers.ConsumerThreads;

import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.util.AbstractMap;
import java.util.AbstractMap.SimpleEntry;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.concurrent.ConcurrentLinkedQueue;

public class KafkaConsumerThread implements Runnable{
    private ConcurrentLinkedQueue<Entry<String, String>> queue;
    private Consumer<String, String> consumer;

    private boolean running;
    private Thread t;
    private String threadName;

    public KafkaConsumerThread(Properties props, ConcurrentLinkedQueue<Entry<String, String>> queue, String[] topics,String name){
        /*Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, boostrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "mqttBridge");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());*/

        this.running = false;
        this.queue = queue;
        this.consumer = new KafkaConsumer<String, String>(props);
        this.consumer.subscribe(Arrays.asList(topics));
        this.threadName = name;
    }

    public void run() {
        this.running = true;
        while(running){
            ConsumerRecords<String, String> consumerRecords = this.consumer.poll(100);
            for(ConsumerRecord<String, String> consumerRecord : consumerRecords){
                Entry entry = new SimpleEntry(consumerRecord.key(), consumerRecord.value());
                queue.add(entry);
            }
        }
    }

    public void start(){
        if(t == null){
            t = new Thread(this, this.threadName);
            t.start();
        }
    }

    public void stop(){
        this.running = false;
    }
}
