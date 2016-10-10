package at.ac.tuwien.dsg.common.sdapi;

public interface Consumer {

	public void setUp();
	
	public void onEvent(Event e);
	
	public void close();
}
