package ac.at.tuwien.dsg.functions;

import ac.at.tuwien.dsg.models.BTSAlarm;
import org.apache.flink.api.common.functions.FlatMapFunction;
import org.apache.flink.util.Collector;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JSONMapper implements FlatMapFunction<String, BTSAlarm> {
    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void flatMap(String value, Collector<BTSAlarm> out) throws Exception {
        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(value);
        BTSAlarm alarm = new BTSAlarm();

        try{
            alarm.setId(Long.parseLong((String) jsonObject.get("id")));
            alarm.setParameterId(Long.parseLong((String) jsonObject.get("parameter_id")));
            alarm.setAlarmId(Long.parseLong((String) jsonObject.get("alarm_id")));
            alarm.setStationId(Long.parseLong((String) jsonObject.get("station_id")));
            alarm.setValue(Double.parseDouble((String) jsonObject.get("value")));
            alarm.setStartTimeFromString((String) jsonObject.get("start_time"));
            alarm.setEndTimeFromString((String) jsonObject.get("end_time"));
            alarm.setThreshold(Double.parseDouble((String) jsonObject.get("threshold")));
            logger.info("successfully parsed new BTS alarm");
        }catch(Exception e){
            logger.error("could not parse received json: "+value);
            logger.error(e.getMessage());
            alarm = null;
        }
        if(alarm != null) out.collect(alarm);
    }
}
