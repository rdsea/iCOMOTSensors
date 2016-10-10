package at.ac.tuwien.dsg.sensor;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;

import at.ac.tuwien.dsg.common.sdapi.Bootstrapable;
import at.ac.tuwien.dsg.common.sdapi.Event;
import at.ac.tuwien.dsg.common.sdapi.RefreshableProducerDelegate;
import at.ac.tuwien.dsg.common.sdapi.RefreshableSchedulerDelegat;


public class LocationSensor implements Runnable, Bootstrapable {

	private static Logger LOGGER = Logger.getLogger(LocationSensor.class);
	private RefreshableProducerDelegate producerDelegate;
	private RefreshableSchedulerDelegat schedulerDelegate;
	
	private ScheduledExecutorService scheduler = null;
	//private int updates = 1;
	
	private int updateRate = 5;//5 seconds

	public LocationSensor() {
	}

	public void setRootDependency(Object o) {
		// do nothing
	}

	public void start() {
		LOGGER.info("Starting Location Sensor ...");
		scheduler = Executors.newScheduledThreadPool(1);
		//scheduler.scheduleAtFixedRate(this, 0, this.updateRate, TimeUnit.SECONDS);
		//FIXME: We should not read the data file multiple times
		scheduler.scheduleAtFixedRate(DataProvider.getProvider(), 0, 5, TimeUnit.SECONDS);
		
		schedulerDelegate.addRunnable(this);
		schedulerDelegate.start();
	}

	public void run() {
		  GenericDataInstance temp = DataProvider.getProvider().getNextInstance();
	        if (temp == null) {
	            LOGGER.info(String.format("Empty stack"));
	            return;
	        }
	        LOGGER.info(String.format("Reading update number - %s ", temp.getJSON()));
	        this.producerDelegate.push(new Event(temp.getJSON()));
//	        updates++;
		

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
	
	
	public int getUpdateRate() {
		return updateRate;
	}

	public void setUpdateRate(int updateRate) {
		this.updateRate = updateRate;
	}

	public static void main(String[] args) {
	}
}
