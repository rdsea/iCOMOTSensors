package cloudBrokers.Producers;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.AbstractMap;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.concurrent.ConcurrentLinkedQueue;

public class KafkaProducerThread implements Runnable{
    private boolean running;
    private Thread t;
    private String threadName;

    private ConcurrentLinkedQueue<Entry<String, String>> queue;
    private Producer<String, String> producer;

    public KafkaProducerThread(Properties props, ConcurrentLinkedQueue<Entry<String, String>> queue,String name){
        /*Properties propss = new Properties();
        propss.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        propss.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class.getName());
        propss.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class.getName());*/

        this.running = false;
        this.queue = queue;
        this.producer = new KafkaProducer<String, String>(props);
        this.threadName = name;
    }

    public void run() {
        this.running = true;
        while(running){
            Entry<String, String> entry = this.queue.poll();
            if(entry != null){
                ProducerRecord<String, String> producerRecord = new ProducerRecord<>(entry.getKey(), entry.getKey(), entry.getValue());
                this.producer.send(producerRecord);
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
