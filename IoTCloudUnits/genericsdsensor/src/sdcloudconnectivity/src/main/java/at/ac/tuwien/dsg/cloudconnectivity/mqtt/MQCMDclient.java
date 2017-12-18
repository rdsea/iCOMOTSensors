package at.ac.tuwien.dsg.cloudconnectivity.mqtt;

import java.net.URI;
import java.net.URISyntaxException;


import at.ac.tuwien.dsg.common.sdapi.Event;

public class MQCMDclient {

	public static void main(String[] args) {
		if(args.length !=2){
			System.out.println("USAGE: (producer|consumer) brokerIP ");
			System.exit(1);
		}
		if ("consumer".equals(args[0])) {
			System.out.println("Starting consumer ...");
			MQConsumer listener = new MQConsumer(args[1]);
			listener.setUp();
			System.out.println("Sucessfully connnected to ");
		} else if ("producer".equals(args[0])) {
			System.out.println("Starting producer ...");
			MQProducer producer = new MQProducer(args[1]);
			producer.setUp();
			producer.push(new Event("This is a meassage!"));
			System.out.println("Sucessfully sent message to ");
			producer.close();
		}

	}

}
