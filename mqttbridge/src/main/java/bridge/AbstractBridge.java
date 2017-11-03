package bridge;

import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttException;

import java.net.InetAddress;

public abstract class AbstractBridge {
    MqttAsyncClient client;

    public AbstractBridge(String serverURI, String clientId){
        try {
            this.client = new MqttAsyncClient(serverURI, clientId);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    public abstract void publishToCloud();

    public abstract void publishToMqtt();
}
