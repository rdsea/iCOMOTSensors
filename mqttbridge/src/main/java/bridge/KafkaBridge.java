package bridge;

import cloudBrokers.ConsumerThreads.KafkaConsumerThread;
import cloudBrokers.Producers.KafkaProducerThread;
import mqtt.MqttConsumer;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttCallback;
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

    public void connectKafka(String bootstrapServers){
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class.getName());
        this.kafkaProducerThread = new KafkaProducerThread(props, cloudQueue, "kafkaProducer");
        this.kafkaProducerThread.start();
    }

    @Override
    public void subscribe(String[] topics) throws MqttException {
        int[] qos = new int[topics.length];
        for(int i=0;i<qos.length;i++){
            qos[i] = 0;
        }
        this.client.subscribe(topics, qos);
    }
}
