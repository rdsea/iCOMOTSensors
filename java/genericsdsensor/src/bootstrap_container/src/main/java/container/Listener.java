package container;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Observable;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import sdapi.container.IRefreshable;

public class Listener extends Observable implements Runnable {

	private static final Logger LOGGER = Logger.getLogger(Listener.class);
	private final AbstractApplicationContext context;
	private long timestamp;
	private Set<IRefreshable> existingRefresables = new HashSet<IRefreshable>();
	private final Resource beansRes;

	public Listener(AbstractApplicationContext context, Resource beansRes) {
		this.context = context;
		this.beansRes = beansRes;
		try {
			this.timestamp = this.beansRes.lastModified();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void run() {
		try {
			long temp = this.beansRes.lastModified();
			// config changed
			if (this.timestamp != temp) {
				// TODO: this works well for simple dependency trees. Use the below strategy+delegate (IRefreshable) to update only part of the tree.
				LOGGER.info("Configuration changed. Updating dependencies ...");
				beforeConfigChange(this.context);
				for (IRefreshable toReferesh : this.existingRefresables) {
					toReferesh.refresh(afterConfigChanged());
				}
				setChanged();
				notifyObservers("update");
				this.timestamp = temp;
			}
		} catch (IOException e) {
			LOGGER.warn("Could not read resources last modified timestamp.", e);
			e.printStackTrace();
		}
	}

	private void beforeConfigChange(final AbstractApplicationContext context) {
		LOGGER.debug("List refreshable instances before refreshing context ...");
		Map<String, IRefreshable> refreshableServices = context.getBeansOfType(IRefreshable.class);
		for (Map.Entry<String, IRefreshable> entry : refreshableServices.entrySet()) {
			Object beanRef = entry.getValue();
			if (beanRef instanceof IRefreshable) {
				IRefreshable refresh = (IRefreshable) beanRef;
				LOGGER.debug(String.format("\tFound refreshable instance %s(%s), with delegating property of type %s.", entry.getKey(), beanRef, ((IRefreshable) beanRef).getProperty()));
				existingRefresables.add(refresh);
			}
		}
		LOGGER.debug("DONE!");
	}

	private List<IRefreshable> afterConfigChanged() {
		LOGGER.debug("List refreshable instances after refreshing context ...");
		AbstractApplicationContext newContext = null;
		try {
			List<IRefreshable> newRefreshables = new ArrayList<IRefreshable>();
			newContext = new FileSystemXmlApplicationContext(this.beansRes.getFile().getAbsolutePath());
			Map<String, IRefreshable> refreshableServices = newContext.getBeansOfType(IRefreshable.class);
			for (Map.Entry<String, IRefreshable> entry : refreshableServices.entrySet()) {
				Object beanRef = entry.getValue();
				if (beanRef instanceof IRefreshable) {
					IRefreshable refresh = (IRefreshable) beanRef;
					LOGGER.info(String.format("Found refreshable instance %s(%s), with delegating property of type %s.", entry.getKey(), beanRef, ((IRefreshable) beanRef).getProperty()));
					newRefreshables.add(refresh);
				}
			}
			LOGGER.debug("DONE!");
			return newRefreshables;
		} catch (IOException e) {
			LOGGER.error("Could not read updated beans definitions!", e);
			e.printStackTrace();
			return null;
		} finally {
			if (newContext != null) {
				newContext.close();
			}
		}

	}

	public static <T> Map<String, T> extractBeans(Class<T> beanType, List<String> contextXmls, ApplicationContext parentContext) throws Exception {

		List<String> paths = new ArrayList<String>();
		try {
			for (String xml : contextXmls) {
				File file = File.createTempFile("spring", "xml");
				// ... write the file using a utility method
				// FileUtils.writeStringToFile(file, xml, "UTF-8");
				paths.add(file.getAbsolutePath());
			}

			String[] pathArray = paths.toArray(new String[0]);
			return buildContextAndGetBeans(beanType, pathArray, parentContext);

		} finally {
			// ... clean up temp files immediately
		}
	}

	private static <T> Map<String, T> buildContextAndGetBeans(Class<T> beanType, String[] paths, ApplicationContext parentContext) throws Exception {

		FileSystemXmlApplicationContext context = new FileSystemXmlApplicationContext(paths, false, parentContext) {
			@Override
			// suppress refresh events bubbling to parent context
			public void publishEvent(ApplicationEvent event) {
			}

			@Override
			protected Resource getResourceByPath(String path) {
				return new FileSystemResource(path); // support absolute paths
			}
		};

		try {
			// avoid classloader errors in some environments
			context.setClassLoader(beanType.getClassLoader());
			context.refresh(); // parse and load context
			Map<String, T> beanMap = context.getBeansOfType(beanType);

			return beanMap;
		} finally {
			try {
				context.close();
			} catch (Exception e) {
				// ... log this
			}
		}
	}

	// private void updateDependencies() {
	// List<String> definitions = Arrays.asList(xmlDefinition);
	// Map<String, Main> beans = extractBeans(IRefreshable.class, definitions, context);
	// if (beans.size() != 1) {
	// throw new RuntimeException("Invalid number of beans: " + beans.size());
	// }
	// // this.protocol = beans.values().iterator().next();
	// }
}
