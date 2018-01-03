package ac.at.tuwien.dsg;

import org.apache.flink.streaming.api.functions.source.SourceFunction;
import org.eclipse.paho.client.mqttv3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicBoolean;

public class MqttSource implements SourceFunction<String>, MqttCallback {
    private AtomicBoolean running;
    private ConcurrentLinkedQueue<String> queue;
    private transient MqttAsyncClient mqtt;

    private String broker;
    private String[] topics;
    private String clientId;
    // TODO add support for authentication of mqtt broker

    Logger logger = LoggerFactory.getLogger(this.getClass());

    public MqttSource(String broker, String clientId, String[] topics){
        this.broker = broker;
        this.clientId = clientId;
        this.topics = topics;
        this.running = new AtomicBoolean(false);
        this.queue = new ConcurrentLinkedQueue();
    }

    @Override
    public void run(SourceContext<String> sourceContext) throws Exception {
        this.mqtt = new MqttAsyncClient(this.broker, this.clientId);
        IMqttToken token = this.mqtt.connect();
        token.waitForCompletion();
        logger.info("source connected to mqtt broker");

        this.mqtt.setCallback(this);
        for(String topic: this.topics){
            this.mqtt.subscribe(topic, 0);
        }

        this.running.set(true);

        while(this.running.get()){
            String value = (String) this.queue.poll();
            if(value != null){
                System.out.println("value");
                sourceContext.collect(value);
            }
        }
    }

    @Override
    public void cancel() {
        try {
            this.stop();
        } catch (MqttException e) {
            logger.error("failed to disconnect from mqtt broker");
            logger.error(e.getMessage());
            e.printStackTrace();
        }
    }

    private void stop() throws MqttException {
        logger.info("stopping mqtt source");
        if(this.mqtt.isConnected()){
            this.mqtt.disconnect();
        }
    }

    @Override
    public void connectionLost(Throwable throwable) {
        logger.error("connection to mqtt broker lost!");
        logger.error(throwable.getMessage());
        try {
            this.mqtt.reconnect();
        } catch (MqttException e) {
            logger.error("failed to reconnect to mqtt broker");
            logger.error(e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void messageArrived(String topic, MqttMessage mqttMessage) throws Exception {
        logger.info("received new message from topic "+topic+" at "+System.currentTimeMillis());
        this.queue.add(new String(mqttMessage.getPayload()));
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {

    }
}
