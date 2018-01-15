package at.ac.tuwien.dsg.sensor;
import at.ac.tuwien.dsg.MqttAppender;
import at.ac.tuwien.dsg.common.sdapi.RefreshableProducerDelegate;
import at.ac.tuwien.dsg.common.sdapi.RefreshableSchedulerDelegat;
import at.ac.tuwien.dsg.common.sdapi.SchedulerSettings;

import at.ac.tuwien.dsg.cloudconnectivity.mqtt.MQProducer;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;


public class SimpleCommandLineGenericSensor {
    public static void main(String [] args) {
        setRemoteLogging(args[0]);

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

    public static void setRemoteLogging(String configFile){
        JSONParser parser = new JSONParser();
        JSONObject jsonObject = null;
        try{
            Object obj = parser.parse(new FileReader(configFile));
            jsonObject = (JSONObject) obj;

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        if(!(Boolean) jsonObject.get("remoteLogging")) return;
        JSONObject broker = (JSONObject) jsonObject.get("remoteLoggingBroker");

        System.out.println(broker.toJSONString());
        MqttAppender mqttAppender = new MqttAppender();
        mqttAppender.setBroker((String) broker.get("broker"));
        mqttAppender.setClientId((String) jsonObject.get("clientId")+"_logger");
        mqttAppender.setTopic((String) broker.get("topic"));

        mqttAppender.activateOptions();
        Logger.getRootLogger().addAppender(mqttAppender);
    }
}
