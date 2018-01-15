package at.ac.tuwien.dsg.cloudconnectivity.mqtt;

import java.io.BufferedReader;
import java.io.FileReader;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

import org.apache.log4j.Logger;

import at.ac.tuwien.dsg.common.sdapi.Event;
import at.ac.tuwien.dsg.common.sdapi.Producer;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/*
Writtenb iCOMOT team.
Last change: revised and modifed by Hong-Linh truong

Hong-Linh Truong Revision
8 Oct 2016: change to paho
*/

public class MQProducer implements Producer {

	private static final Logger LOGGER = Logger.getLogger(MQProducer.class);

	private String user = "guest";
	private String password = "guest";
	private String clientID ="testID";
	private String broker;
	private String topic;

	MqttClient mqttClient = null;
	MqttConnectOptions connOpts = null;
  MemoryPersistence persistence = new MemoryPersistence();

	public MQProducer(String broker, String topic) {
		this.topic = topic;
		this.broker = broker;
	}

	public MQProducer(String configFile) {
		// get the broker IP from /etc/environment file
		//makesure you have set the iCOMMOT_CLOUDCONNECTIVITY_DIR

		JSONParser parser = new JSONParser();
		try {
			Object obj = parser.parse(new FileReader(configFile));
			JSONObject jsonObject = (JSONObject) obj;
			String server = (String) jsonObject.get("server");
			user= (String)jsonObject.get("username");
			password = (String)jsonObject.get("password");
			Long port     = (Long)jsonObject.get("port");
			String topic    =(String)jsonObject.get("topic");
			this.topic = topic;
			this.broker ="tcp://"+server+":"+port;
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void setUp() {

		try {

			LOGGER.info(String.format("Trying to connect to %s ...",this.broker ));

			mqttClient = new MqttClient(broker, clientID, persistence);
      connOpts = new MqttConnectOptions();
      connOpts.setCleanSession(true);
      connOpts.setUserName(user);
      connOpts.setPassword(password.toCharArray());
      System.out.println("Connecting to broker: "+broker);
      mqttClient.connect(connOpts);
      System.out.println("Connected");

			LOGGER.info(String.format("Successfully connected to %s.",this.broker ));
		} catch (Exception e) {
			LOGGER.error("Cloud not start MQTT producer client!", e);
			e.printStackTrace();
		}
	}

	public void push(Event e) {
		try {
			MqttMessage message = new MqttMessage(e.getEventContent().getBytes());
			message.setQos(0);
			mqttClient.publish(topic, message);
			System.out.println("Message published");

			//sampleClient.disconnect();
			//System.out.println("Disconnected");
			//sampleClient.publish(topic, message);
			//producer.send(message);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
	public void close() {
		LOGGER.info("Closing MQTT producer client!");
		try {
			if (this.mqttClient != null)
				this.mqttClient.disconnect();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void pollEvent() {
		throw new UnsupportedOperationException();

	}

}
