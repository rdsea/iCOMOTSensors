import bridge.KafkaBridge;
import org.eclipse.paho.client.mqttv3.MqttException;

public class Main {
    public static void main(String[] args){
        KafkaBridge bridge = new KafkaBridge();
        String[] topics = new String[1];
        topics[0] = "test";
        try {
            bridge.connect("tcp://localhost:1883", "testClient");
            bridge.subscribe(topics);
            bridge.connectKafka("localhost:9092");
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
}
