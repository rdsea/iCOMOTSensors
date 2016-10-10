package sdapi.container;

public interface Bootstrapable {

	public void setRootDependency(Object o);
	public void start();
	public void stop();
}
