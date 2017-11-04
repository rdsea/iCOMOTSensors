package bridge;

import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttException;

import java.net.InetAddress;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;

public abstract class AbstractBridge {
    ConcurrentLinkedQueue<Map.Entry<String, String>> mqttQueue;
    ConcurrentLinkedQueue<Map.Entry<String, String>> cloudQueue;
    MqttAsyncClient client;

    public AbstractBridge(){
        this.mqttQueue = new ConcurrentLinkedQueue<>();
        this.cloudQueue = new ConcurrentLinkedQueue<>();
    }

    public abstract void connect(String serverURI, String clientId) throws MqttException;

    public abstract void subscribe(String[] topics) throws MqttException;
}
