package at.ac.tuwien.dsg.common.sdapi;

import java.util.List;

import org.apache.log4j.Logger;

public class RefreshableProducerDelegate implements Producer, IRefreshable {

	private static Logger LOGGER = Logger.getLogger(RefreshableProducerDelegate.class);
	private Producer protocol;
	private boolean running = false;

	public void setProtocol(Producer protocol) {
		this.protocol = protocol;
	}

	public Producer getProtocol() {
		return protocol;
	}

	public void refresh(List<IRefreshable> newDependencies) {
		for (IRefreshable refersh : newDependencies) {
			if (refersh.getProperty() instanceof Producer) {
				// it is new me!
				close();
				this.protocol = (Producer) refersh.getProperty();
			}
		}
		LOGGER.info(String.format("Communication protocol changed. Currently set to %s", this.protocol.getClass().getName()));
	}

	// delegation methods
	public void setUp() {
		protocol.setUp();
		this.running = true;
	}

	public void push(Event e) {
		if (!running) {
			setUp();
		}
		protocol.push(new Event(e.getEventContent()));
	}

	public void pollEvent() {
		protocol.pollEvent();
	}

	public void close() {
		protocol.close();
		this.running = false;
	}

	public void setProperty() {
		this.protocol.setUp();

	}

	public Object getProperty() {
		return this.protocol;
	}

}
