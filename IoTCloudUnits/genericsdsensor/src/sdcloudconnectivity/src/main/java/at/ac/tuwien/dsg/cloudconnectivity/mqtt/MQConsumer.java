package at.ac.tuwien.dsg.cloudconnectivity.mqtt;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.apache.log4j.Logger;

import at.ac.tuwien.dsg.common.sdapi.Consumer;
import at.ac.tuwien.dsg.common.sdapi.Event;



public class MQConsumer implements  Consumer {

	private static final Logger LOGGER = Logger.getLogger(MQConsumer.class);
	private String user = "guest";
	private String password = "guest";
	private String clientID ="testID";
	private String broker;
	private String subject;

	MqttClient mqttClient = null;
	MqttConnectOptions connOpts = null;
	MemoryPersistence persistence = new MemoryPersistence();
  public MQConsumer(String configFile) {
		
	}
	public MQConsumer(String broker, String topic) {
		this.broker = broker;
		this.subject = topic;
	}

	public void setUp() {
		LOGGER.info("Starting up MQTT consumer ...");
		try {
			mqttClient = new MqttClient(broker, clientID, persistence);
      connOpts = new MqttConnectOptions();
      connOpts.setCleanSession(true);
      connOpts.setUserName(user);
      connOpts.setPassword(password.toCharArray());
      System.out.println("Connecting to broker: "+broker);
      mqttClient.connect(connOpts);
      System.out.println("Connected");
			LOGGER.info("MQTT producer started successfully!");
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("Cloud not start MQTT consumer!", e);
		}
	}
/*
	public void onMessage(Message arg0) {
		TextMessage event = (TextMessage) arg0;
		try {
			onEvent(new Event(event.getText()));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
*/
	public void onEvent(Event event) {
		LOGGER.info(String.format("Received event: %s", event.getEventContent()));
	}

	public void onException(Exception e) {
		e.printStackTrace();
	}

	public void close() {
			try {
				if (this.mqttClient != null)
					this.mqttClient.disconnect();
			} catch (Exception e) {
				e.printStackTrace();
			}

	}

}
