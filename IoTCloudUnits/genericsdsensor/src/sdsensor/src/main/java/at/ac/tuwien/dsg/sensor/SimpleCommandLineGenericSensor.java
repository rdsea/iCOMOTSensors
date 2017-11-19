package at.ac.tuwien.dsg.sensor;
import at.ac.tuwien.dsg.common.sdapi.RefreshableProducerDelegate;
import at.ac.tuwien.dsg.common.sdapi.RefreshableSchedulerDelegat;
import at.ac.tuwien.dsg.common.sdapi.SchedulerSettings;

import at.ac.tuwien.dsg.cloudconnectivity.mqtt.MQProducer;


public class SimpleCommandLineGenericSensor {
    public static void main(String [] args) {
        GenericSensor sensor = new GenericSensor();

        RefreshableSchedulerDelegat schedulerDelegate = new RefreshableSchedulerDelegat();
        RefreshableProducerDelegate producerDelegate = new RefreshableProducerDelegate();

        // provide a page for a mqtt protocol
        MQProducer protocol = new MQProducer(args[0]);
        producerDelegate.setProtocol(protocol);

        // provide dataset
        sensor.setDataFileSource(args[1]);
        if(args.length > 2 && args[2].equals("test")){
            sensor.setTestMode(true);
            System.out.println("test mode activated");
        }

        SchedulerSettings setting = new SchedulerSettings();
        setting.setUpdateRate(5);
        schedulerDelegate.setSettings(setting);
        sensor.setProducerDelegate(producerDelegate);
        sensor.setSchedulerDelegate(schedulerDelegate);
        sensor.start();
    }
}
