package at.ac.tuwien.dsg.cloudconnectivity.coap;

import java.net.SocketException;

import org.eclipse.californium.core.CoapResource;
import org.eclipse.californium.core.CoapServer;
import org.eclipse.californium.core.coap.CoAP.ResponseCode;
import org.eclipse.californium.core.server.resources.CoapExchange;
import org.eclipse.californium.core.server.resources.Resource;

import at.ac.tuwien.dsg.common.sdapi.Event;
import at.ac.tuwien.dsg.common.sdapi.Producer;

public class CoapThinServer implements Producer {

	private static Event currentEvent = null;
	private HelloWorldServer server = null;
	
	public void push(Event e) {
		//System.out.println("CoAP sends: " + e.getEventContent());
		currentEvent = e;
	}

	public void setUp() {
		System.out.println("Starting CoAP client!");
		  try {
	            this.server = new HelloWorldServer(new HelloWorldResource());
	            server.start();
	            
	        } catch (SocketException e) {
	            
	            System.err.println("Failed to initialize server: " + e.getMessage());
	        }
		  currentEvent = new Event("Default");
	    
	}

	public void pollEvent() {
		throw new UnsupportedOperationException();
	}

	public void close() {
		System.out.println("Stopping CoAP client!");
		this.server.stop();
		this.server.destroy();
	}
	
	public static Event getCurrent(){
		return currentEvent;
	}
	
private static class HelloWorldServer extends CoapServer {
	
	 public HelloWorldServer(Resource res) throws SocketException {
	        super();
	    }
}

private static class HelloWorldResource extends CoapResource {
        
        public HelloWorldResource() {
            
            // set resource identifier
            super("helloWorld",true);
            
            // set display name
            getAttributes().setTitle("Hello-World Resource");
            System.out.println("CREATED HELLO WORLD RESOURCE ...");
        }
        
        @Override
        public void handleGET(CoapExchange exchange) {
            
            // respond to the request
        	System.out.println("Responding to a GET request from "+exchange.getSourceAddress().getHostAddress());
            exchange.respond(ResponseCode.CONTENT,CoapThinServer.getCurrent().getEventContent());
        }
    }

}
