package sdapi.container;

import java.util.List;

public interface IRefreshable {

	public Object getProperty();
	public void refresh(List<IRefreshable> newDependencies);
}
