package sdapi.com;

public interface Consumer {

	public void setUp();
	
	public void onEvent(Event e);
	
	public void close();
}
