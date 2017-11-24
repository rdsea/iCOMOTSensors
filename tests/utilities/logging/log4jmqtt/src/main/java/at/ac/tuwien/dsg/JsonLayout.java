package at.ac.tuwien.dsg;

import org.apache.log4j.Layout;
import org.apache.log4j.spi.LoggingEvent;
import org.json.simple.JSONObject;

public class JsonLayout extends Layout {
    private String clientId;

    public JsonLayout(String clientId){
        this.clientId = clientId;
    }

    public String format(LoggingEvent loggingEvent) {
        JSONObject object = new JSONObject();

        object.put("client", this.clientId);
        object.put("timestamp", loggingEvent.getTimeStamp());
        object.put("errorLevel", loggingEvent.getLevel().toString());
        object.put("message", loggingEvent.getMessage().toString());
        object.put("loggerName", loggingEvent.getLoggerName());

        return object.toJSONString();
    }

    public boolean ignoresThrowable() {
        return false;
    }

    public void activateOptions() {

    }
}
