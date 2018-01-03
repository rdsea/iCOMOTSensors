package at.ac.tuwien.dsg;

import org.apache.log4j.AppenderSkeleton;
import org.apache.log4j.spi.LoggingEvent;
import org.eclipse.paho.client.mqttv3.*;

public class MqttAppender extends AppenderSkeleton implements MqttCallback {
    private String user = "xxx";
    private String password = "xxx";
    private String clientId = "client"; // TODO make this configurable
    private String broker;
    private String topic; // TODO make this configurable

    private MqttAsyncClient mqtt;

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getBroker() {
        return broker;
    }

    public void setBroker(String broker) {
        this.broker = broker;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    // TODO integrate credentials here in the future
    private void connect(){
        try {
            this.mqtt = new MqttAsyncClient(broker, this.clientId, null);
            this.mqtt.setCallback(this);
            IMqttToken token = this.mqtt.connect();
            token.waitForCompletion();
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    protected synchronized void append(LoggingEvent loggingEvent) {
        MqttMessage message = new MqttMessage();
        message.setPayload(this.layout.format(loggingEvent).toString().getBytes());
        try {
            this.mqtt.publish(this.topic, message);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }


    public synchronized void close() {
        try {
            this.mqtt.disconnect();
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }


    public boolean requiresLayout() {
        return false;
    }

    public void connectionLost(Throwable throwable) {
        try {
            this.mqtt.reconnect();
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    public void activateOptions(){
        this.setLayout(new JsonLayout(this.clientId));
        this.connect();
    }

    public void messageArrived(String s, MqttMessage mqttMessage) throws Exception {
        // we do not receive any messages
    }

    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
        // we do not need to know if the delivery is complete
    }
}
