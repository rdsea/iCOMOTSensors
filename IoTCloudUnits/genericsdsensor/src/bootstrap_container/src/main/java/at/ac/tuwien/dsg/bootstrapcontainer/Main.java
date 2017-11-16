package at.ac.tuwien.dsg.bootstrapcontainer;

import java.util.Observable;
import java.util.Observer;
import java.util.Scanner;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import at.ac.tuwien.dsg.bootstrapcontainer.util.ConfigReader;
import at.ac.tuwien.dsg.bootstrapcontainer.util.Properties;
import at.ac.tuwien.dsg.common.sdapi.Bootstrapable;
import at.ac.tuwien.dsg.common.sdapi.IRefreshable;

public class Main implements Observer {

	private static final Logger LOGGER = Logger.getLogger(Main.class);
	private String mainClass = "";
	private AbstractApplicationContext context;
	private ScheduledExecutorService scheduler;
	private Thread app = null;
	private Thread stopListener = null;
	private Bootstrapable application = null;
	private boolean isStopped = false;

	public static void main(String[] args) {
		// PRE: Before the container is started configuration manager creates working directory for the units.
		// TODO: Currently, to perform runtime configuration changes, all dependencies have to be available when starting the container.
		// TODO: We need to provide a custom class loader to add dependencies to the factory dynamically.
		Main container = new Main();
		container.startContainer();
	}

	private void startContainer() {
		LOGGER.info("Starting bootstrap container ...");
		ResourceLoader resLoader = new DefaultResourceLoader(Main.class.getClassLoader());
		Resource res = resLoader.getResource(ResourceLoader.CLASSPATH_URL_PREFIX+Properties.DEFAULT_CONFIG.getValue());
		if(!res.exists()){
			LOGGER.error(String.format("Could not find default configuration! Expected on the classpath in %s file!",Properties.DEFAULT_CONFIG.getValue()));
			System.exit(1);
		}
		this.mainClass = ConfigReader.getProperty(res, Properties.MAIN.getValue());
		this.context = new ClassPathXmlApplicationContext(ConfigReader.getProperty(res, Properties.BEANS.getValue()));
		this.application = (Bootstrapable) this.context.getBean(this.mainClass);

		LOGGER.info("Starting application ...");
		Runnable r = new Runnable() {
			public void run() {
				application.start();
			}
		};
		app = new Thread(r);
		app.start();
		
		LOGGER.info("Starting configuration listner ...");
		Resource beansRes = resLoader.getResource(ResourceLoader.CLASSPATH_URL_PREFIX+ConfigReader.getProperty(res, Properties.BEANS.getValue()));
		Listener configListener = new Listener(context, beansRes);
		configListener.addObserver(this);
		this.scheduler = Executors.newScheduledThreadPool(1);
		scheduler.scheduleAtFixedRate(configListener, 0, 1, TimeUnit.SECONDS);

		Runnable stopListener = new Runnable() {
			public void run() {
				Scanner scanner = new Scanner(System.in);
				String command = "";
				while (!isStopped && (command = scanner.nextLine()) != null) {
					if ("".equals(command)) {
						stopContainer();
						isStopped = true;
					}
				}
				scanner.close();
			}
		};
		this.stopListener = new Thread(stopListener);
		this.stopListener.start();
		LOGGER.info("DONE! - Hit Enter to stop the container!");
	}

	public void stopContainer() {
		LOGGER.info("Stopping bootstrap container ...");
		this.context.stop();
		this.scheduler.shutdown();
		application.stop();
		if (app != null) {
			try {
				this.app.join();
			} catch (Exception e) {
				LOGGER.debug("Error stoping application!");
			}
		}
		if (this.stopListener != null) {
			try {
				this.stopListener.interrupt();
			} catch (Exception e) {
				LOGGER.debug("Error stoping application!");
			}
		}
		LOGGER.debug("Container Stopped!");
	}

	

	public void update(Observable o, Object arg) {
		LOGGER.info("Receiving from observables...");
		if (o instanceof Listener) {
			String e = (String) arg;
			if ("update".equals(e)) {
				LOGGER.info("Restarting application for new configuration!");
				Bootstrapable mainObject = (Bootstrapable) this.context.getBean(this.mainClass);
				LOGGER.debug(String.format("Old application %s - new application %s", application, mainObject));
				LOGGER.debug("Currently have IRefreshable: " + context.getBeansOfType(IRefreshable.class).size());
				LOGGER.debug("Producer set to:  " + context.getBean("producer"));
			}

		}

	}

}
