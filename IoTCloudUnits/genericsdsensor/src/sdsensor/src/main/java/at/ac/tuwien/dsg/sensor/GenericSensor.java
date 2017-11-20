package at.ac.tuwien.dsg.sensor;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javafx.scene.chart.PieChart;
import org.apache.log4j.Logger;

import at.ac.tuwien.dsg.common.sdapi.Bootstrapable;
import at.ac.tuwien.dsg.common.sdapi.Event;
import at.ac.tuwien.dsg.common.sdapi.RefreshableProducerDelegate;
import at.ac.tuwien.dsg.common.sdapi.RefreshableSchedulerDelegat;
import at.ac.tuwien.dsg.common.sdapi.SchedulerSettings;

import at.ac.tuwien.dsg.cloudconnectivity.mqtt.MQProducer;

public class GenericSensor implements Runnable, Bootstrapable {

	private static Logger LOGGER = Logger.getLogger(GenericSensor.class);
	private RefreshableProducerDelegate producerDelegate;
	private RefreshableSchedulerDelegat schedulerDelegate;

	private ScheduledExecutorService scheduler = null;
	private String dataFileSource = null;

	private boolean testMode = false;
	// private int updates = 1;

	private int updateRate = 5;// 5 seconds

	public GenericSensor() {

	}


	// initi some information when called from the main method
	// this function is called when you want to run the sensor by
	// calling its main method
	/*
	 * public void localInitilization() { schedulerDelegate = new
	 * RefreshableSchedulerDelegat(); producerDelegate = new
	 * RefreshableProducerDelegate(); SchedulerSettings setting = new
	 * SchedulerSettings(); setting.setUpdateRate (updateRate);
	 * schedulerDelegate.setSettings(setting); }
	 */
	public void setRootDependency(Object o) {
		// do nothing
	}

	public void setDataFileSource(String fileName) {
		dataFileSource = fileName;
	}

	public void start() {
		LOGGER.info("Starting Location Sensor ...");
		scheduler = Executors.newScheduledThreadPool(1);
		// scheduler.scheduleAtFixedRate(this, 0, this.updateRate,
		// TimeUnit.SECONDS);

		if(this.testMode){
			DataProvider.setTestMode(this.testMode);
		}
		// FIXME: We should not read the data file multiple times
		scheduler.scheduleAtFixedRate(DataProvider.getProvider(), 0, 5, TimeUnit.SECONDS);

		schedulerDelegate.addRunnable(this);
		schedulerDelegate.start();
	}

	public void run() {
		GenericDataInstance temp = DataProvider.getProvider(dataFileSource).getNextInstance();
		if (temp == null) {
			LOGGER.info(String.format("Empty stack"));
			return;
		}
		LOGGER.info(String.format("Reading update number - %s ", temp.getJSON()));
		this.producerDelegate.push(new Event(temp.getJSON()));
		// updates++;

	}

	public RefreshableSchedulerDelegat getSchedulerDelegate() {
		return schedulerDelegate;
	}

	public void setSchedulerDelegate(RefreshableSchedulerDelegat schedulerDelegate) {
		this.schedulerDelegate = schedulerDelegate;
	}

	public void setProducerDelegate(RefreshableProducerDelegate producer) {
		this.producerDelegate = producer;
	}

	public void stop() {
		LOGGER.info("Stoppinng Location Sensor ...");
		if (scheduler != null) {
			scheduler.shutdown();
			this.producerDelegate.close();
		}

		schedulerDelegate.stop();
	}

	public void setTestMode(boolean testMode){
		this.testMode = testMode;
	}

	public int getUpdateRate() {
		return updateRate;
	}

	public void setUpdateRate(int updateRate) {
		this.updateRate = updateRate;
	}

}
