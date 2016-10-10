package smapClient;

import sdapi.com.Event;
import sdapi.com.Producer;

public class SmapMock implements Producer{

	public void push(Event e) {
		System.out.println("sMAP sends: " + e.getEventContent());
	}

	public void setUp() {
		System.out.println("Starting sMAP client!");
	}

	public void pollEvent() {
		throw new UnsupportedOperationException();
	}

	public void close() {
		//throw new UnsupportedOperationException();
		System.out.println("Stopping sMAP client!");
	}
}
