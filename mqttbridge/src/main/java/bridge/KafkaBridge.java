package bridge;

import cloudBrokers.ConsumerThreads.KafkaConsumerThread;
import cloudBrokers.Producers.KafkaProducerThread;
import mqtt.MqttConsumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttException;

import java.util.Properties;

public class KafkaBridge extends AbstractBridge {
    KafkaProducerThread kafkaProducerThread;
    KafkaConsumerThread kafkaConsumerThread;

    public KafkaBridge(){
        super();
    }

    @Override
    public void connect(String serverURI, String clientId) throws MqttException{
        this.client = new MqttAsyncClient(serverURI, clientId);
        this.client.setCallback(new MqttConsumer(this.cloudQueue));
        IMqttToken token = this.client.connect();
        token.waitForCompletion();
    }

    public void connectKafka(String bootstrapServers, String[] topics){
        Properties producerProps = new Properties();
        producerProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        producerProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class.getName());
        producerProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class.getName());
        this.kafkaProducerThread = new KafkaProducerThread(producerProps, cloudQueue, "kafkaProducer");
        this.kafkaProducerThread.start();

        Properties consumerProps = new Properties();
        consumerProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        consumerProps.put(ConsumerConfig.GROUP_ID_CONFIG, "mqttBridge");
        consumerProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        consumerProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        this.kafkaConsumerThread = new KafkaConsumerThread(consumerProps, this.client, topics, "kafkaConsumer");
        this.kafkaConsumerThread.start();
    }

    @Override
    public void subscribe(String[] topics) throws MqttException {
        int[] qos = new int[topics.length];
        for(int i=0;i<qos.length;i++){
            qos[i] = 0;
        }
        this.client.subscribe(topics, qos);
    }

    @Override
    public void stop() {
        System.out.println("stopping bridge");
        this.kafkaConsumerThread.stop();
        this.kafkaProducerThread.stop();
        
        try {
            this.client.disconnect();
            this.client.close();
        } catch (MqttException e) {
            System.out.println("error closing mqtt client");
            e.printStackTrace();
        }

    }
}
