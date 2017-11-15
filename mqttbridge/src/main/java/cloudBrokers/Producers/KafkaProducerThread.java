package cloudBrokers.Producers;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.log4j.Logger;

import java.util.Map.Entry;
import java.util.Properties;
import java.util.concurrent.ConcurrentLinkedQueue;

public class KafkaProducerThread implements Runnable{
    final static Logger logger = Logger.getLogger(KafkaProducerThread.class);

    private boolean running;
    private Thread t;
    private String threadName;

    private ConcurrentLinkedQueue<Entry<String, String>> queue;
    private Producer<String, String> producer;

    public KafkaProducerThread(Properties props, ConcurrentLinkedQueue<Entry<String, String>> queue,String name){
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
                logger.info("sending new message to kafka topic "+entry.getKey());
                this.producer.send(producerRecord);
            }
        }
    }

    public void start(){
        if(t == null){
            logger.info("starting kafka producer");
            t = new Thread(this, this.threadName);
            t.start();
        }
    }

    public void stop(){
        if(t == null) return;

        try {
            this.running = false;
            t.join();
            logger.info("kafka producer stopped");
        } catch (InterruptedException e) {
            logger.warn("error stopping kafka producer");
            e.printStackTrace();
        }
    }
}
