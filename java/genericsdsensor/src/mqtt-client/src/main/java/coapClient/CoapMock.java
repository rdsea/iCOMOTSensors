package coapClient;

import sdapi.com.Event;
import sdapi.com.Producer;

public class CoapMock implements Producer {

	public void push(Event e) {
		System.out.println("CoAP sends: " + e.getEventContent());
	}

	public void setUp() {
		System.out.println("Starting CoAP client!");
	}

	public void pollEvent() {
		throw new UnsupportedOperationException();
	}

	public void close() {
		//throw new UnsupportedOperationException();
		System.out.println("Stopping CoAP client!");
	}

}
