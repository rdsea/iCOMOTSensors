package at.ac.tuwien.dsg.cloudconnectivity.mqtt;

import java.io.BufferedReader;
import java.io.FileReader;

import javax.jms.Connection;
import javax.jms.DeliveryMode;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.log4j.Logger;

import at.ac.tuwien.dsg.common.sdapi.Event;
import at.ac.tuwien.dsg.common.sdapi.Producer;


public class MQProducer implements Producer {

	private static final Logger LOGGER = Logger.getLogger(MQProducer.class);
	private Destination destination;
	private long timeToLive;
	private String user = ActiveMQConnection.DEFAULT_USER;
	private String password = ActiveMQConnection.DEFAULT_PASSWORD;
	private String url;
	private String subject;
	private boolean transacted = false;
	private Session session;
	private MessageProducer producer;
	private Connection connection = null;

	public MQProducer(String url, String topic) {
		this.subject = topic;
		this.url = url;
	}

	public MQProducer() {
		// get the broker IP from /etc/environment file
		String ip = "";
		try {
			BufferedReader br = new BufferedReader(new FileReader("/etc/environment"));

			String line = br.readLine();

			while (line != null) {
				if (line.startsWith("mqtt")) {
					ip = line.split("=")[1];
					break;
				}
				line = br.readLine();
			}
			br.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		if ("".equals(ip)) {
			ip = "127.0.0.1";
		}
		this.url = "failover://tcp://" + ip + ":61616";
		this.subject = "topic";
	}

	public void setUp() {

		try {
			
			LOGGER.info(String.format("Trying to connect to %s ...",this.url ));
			// Create the connection.
			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory(user, password, url);
			connection = connectionFactory.createConnection();
			connection.start();

			// Create the session
			session = connection.createSession(transacted, Session.AUTO_ACKNOWLEDGE);
			destination = session.createTopic(subject);

			// Create the producer.
			producer = session.createProducer(destination);
			producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);

			if (timeToLive != 0) {
				producer.setTimeToLive(timeToLive);
			}
			LOGGER.info(String.format("Successfully connected to %s.",this.url ));
		} catch (Exception e) {
			LOGGER.error("Cloud not start MQTT producer client!", e);
			e.printStackTrace();
		}
	}

	public void push(Event e) {
		try {
			TextMessage message = session.createTextMessage(e.getEventContent());
			producer.send(message);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public void close() {
		LOGGER.info("Closing MQTT producer client!");
		try {
			if (this.connection != null)
				this.connection.close();
		} catch (JMSException e) {
			e.printStackTrace();
		}
	}

	public void pollEvent() {
		throw new UnsupportedOperationException();

	}

}
