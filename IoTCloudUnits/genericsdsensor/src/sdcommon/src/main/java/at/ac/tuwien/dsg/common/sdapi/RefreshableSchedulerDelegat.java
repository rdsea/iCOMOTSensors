package at.ac.tuwien.dsg.common.sdapi;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/*
Written by the iCOMOT team. -
Last revised and modified by Hong-Linh Truong
*/

public class RefreshableSchedulerDelegat implements IRefreshable {

	private SchedulerSettings settings;
	private Runnable sensor;
	private ScheduledExecutorService scheduler = null;

	public SchedulerSettings getSettings() {
		return settings;
	}

	public void setSettings(SchedulerSettings settings) {
		this.settings = settings;
	}

	public void addRunnable(Runnable r) {

		this.sensor = r;
	}

	public void start() {
		scheduler = Executors.newScheduledThreadPool(1);
		if (this.sensor != null){
			if (this.settings == null) {
				System.out.println ("Problem s with scheduling setting");
			}
			else
				scheduler.scheduleAtFixedRate(this.sensor, 0, this.settings.getUpdateRate(), TimeUnit.SECONDS);
		}else{
			throw new IllegalArgumentException("Sensor not set!");
		}
	}

	public void stop() {
		scheduler.shutdown();
	}

	public Object getProperty() {
		return this.settings;
	}

	public void refresh(List<IRefreshable> newDependencies) {
		for (IRefreshable refersh : newDependencies) {
			if (refersh.getProperty() instanceof SchedulerSettings) {
				// it is new me!
				stop();
				this.settings = (SchedulerSettings) refersh.getProperty();
				scheduler = Executors.newScheduledThreadPool(1);
				scheduler.scheduleAtFixedRate(this.sensor, 0, this.settings.getUpdateRate(), TimeUnit.SECONDS);
			}
		}
		//LOGGER.info(String.format("Communication protocol changed. Currently set to %s", this.protocol.getClass().getName()));

	}

}
