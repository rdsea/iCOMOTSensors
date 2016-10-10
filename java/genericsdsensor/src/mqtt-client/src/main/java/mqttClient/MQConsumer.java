package mqttClient;

import javax.jms.Connection;
import javax.jms.Destination;
import javax.jms.ExceptionListener;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.log4j.Logger;

import sdapi.com.Consumer;
import sdapi.com.Event;



public class MQConsumer implements MessageListener, ExceptionListener, Consumer {

	private static final Logger LOGGER = Logger.getLogger(MQConsumer.class);
	private String subject;
	private String user = ActiveMQConnection.DEFAULT_USER;
	private String password = ActiveMQConnection.DEFAULT_PASSWORD;
	private String url = "";
	private boolean transacted;
	private int ackMode = Session.AUTO_ACKNOWLEDGE;
	private Session session;
	private Destination destination;
	private MessageConsumer consumer = null;
	private Connection connection;

	public MQConsumer(String url, String topic) {
		this.url = url;
		this.subject = topic;
	}

	public void setUp() {
		LOGGER.info("Starting up MQTT consumer ...");
		try {
			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory(user, password, url);
			this.connection = connectionFactory.createConnection();
			connection.setExceptionListener(this);
			connection.start();
			session = connection.createSession(transacted, ackMode);
			destination = session.createTopic(subject);
			consumer = session.createConsumer(destination);
			consumer.setMessageListener(this);
			LOGGER.info("MQTT producer started successfully!");
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("Cloud not start MQTT consumer!", e);
		}
	}

	public void onMessage(Message arg0) {
		TextMessage event = (TextMessage) arg0;
		try {
			onEvent(new Event(event.getText()));
		} catch (JMSException e) {
			e.printStackTrace();
		}
	}

	public void onEvent(Event event) {
		LOGGER.info(String.format("Received event: %s", event.getEventContent()));
	}

	public void onException(JMSException e) {
		e.printStackTrace();
	}

	public void close() {
		try {
			consumer.close();
			session.close();
			connection.close();
		} catch (JMSException e) {
			e.printStackTrace();
		}

	}

}
