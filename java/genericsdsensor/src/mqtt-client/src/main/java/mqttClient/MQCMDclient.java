package mqttClient;

import sdapi.com.Event;

public class MQCMDclient {

	public static void main(String[] args) {
		if(args.length !=2){
			System.out.println("USAGE: (producer|consumer) brokerIP ");
			System.exit(1);
		}
		String host = args[1];
		String url = "failover://tcp://" + host + ":61616";

		if ("consumer".equals(args[0])) {
			System.out.println("Starting consumer ...");
			MQConsumer listener = new MQConsumer(url, "topic");
			listener.setUp();
			System.out.println("Sucessfully connnected to " + host);
		} else if ("producer".equals(args[0])) {
			System.out.println("Starting producer ...");
			MQProducer producer = new MQProducer(url, "topic");
			producer.setUp();
			producer.push(new Event("This is a meassage!"));
			System.out.println("Sucessfully sent message to " + host);
			producer.close();
		}

	}

}
