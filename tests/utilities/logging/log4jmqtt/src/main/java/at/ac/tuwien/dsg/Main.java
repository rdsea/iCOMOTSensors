package at.ac.tuwien.dsg;

import org.apache.log4j.Logger;

public class Main {

    // just for testing
    public static void main(String[] args){
        MqttAppender appender = new MqttAppender();
        Logger l = Logger.getLogger("test");
        l.addAppender(appender);
        l.warn("first");
        l.warn("second");
        l.warn("third");

    }
}
