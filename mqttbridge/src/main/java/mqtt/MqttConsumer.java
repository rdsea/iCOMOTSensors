package mqtt;

import org.eclipse.paho.client.mqttv3.*;

import java.util.AbstractMap;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;

public class MqttConsumer implements MqttCallback{
    ConcurrentLinkedQueue<Map.Entry<String, String>> queue;

    public MqttConsumer(ConcurrentLinkedQueue<Map.Entry<String, String>> queue){
        this.queue = queue;
    }

    public void connectionLost(Throwable throwable) {
        System.out.println("Lost connection to MQTT broker");
    }

    public void messageArrived(String topic, MqttMessage mqttMessage) throws Exception {
        AbstractMap.SimpleEntry entry = new AbstractMap.SimpleEntry(topic, new String(mqttMessage.getPayload()));
        queue.add(entry);
        System.out.println("Message received from mqtt: " + new String(mqttMessage.getPayload()));
    }

    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
        // not needed
    }
}
