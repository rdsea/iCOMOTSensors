package at.ac.tuwien.dsg.cloudconnectivity.mqtt;

import java.net.URI;
import java.net.URISyntaxException;

import org.eclipse.californium.core.CoapClient;
import org.eclipse.californium.core.CoapResponse;
import org.eclipse.californium.core.Utils;

import at.ac.tuwien.dsg.common.sdapi.Event;

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
		} else if ("coap".equals(args[0])){
			//Start MQ consumer
			System.out.println("Starting CoAP client ...");
//			MQConsumer listener = new MQConsumer(url, "topic");
//			listener.setUp();
//			System.out.println("Sucessfully connnected to " + host);
			
			//Start CoAP puller
			URI uri = null;
			try {
				uri = new URI(args[1]);
			} catch (URISyntaxException e) {
				System.err.println("Invalid URI: " + e.getMessage());
				System.exit(-1);
			}
			
			System.out.println("\n Starting CoAP client -> "+ uri.toString()+"\n");
			CoapClient client = new CoapClient(uri);
		//	try {
				
			//	while (true){
					CoapResponse response = client.get();
					
					if (response!=null) {					
						System.out.println(Utils.prettyPrint(response.advanced()));
					} else {
						System.out.println("ERROR: No response received.");
					}
						//10s
					//	Thread.sleep(10000);
			//	}
			//} catch (InterruptedException e) {
				// TODO Auto-generated catch block
		//		e.printStackTrace();
			//}
		}

	}

}
