package ac.at.tuwien.dsg.models;

import org.apache.flink.streaming.util.serialization.SerializationSchema;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class AlarmWindowSerializer implements SerializationSchema<AlarmWindow> {
    @Override
    public byte[] serialize(AlarmWindow element) {
        JSONObject alarmWindowObj = new JSONObject();
        JSONArray alarms = new JSONArray();

        for(BTSAlarm alarm : element.getAlarms()){
            JSONObject alarmObj = new JSONObject();
            alarmObj.put("alarm_id", alarm.getAlarmId());
            alarmObj.put("value", alarm.getValue());
            alarmObj.put("station_id", alarm.getStationId());
            alarmObj.put("start_time", alarm.getStartTime().getTime());
            alarmObj.put("end_time", alarm.getEndTime().getTime());
            alarmObj.put("threshold", alarm.getThreshold());
            alarmObj.put("parameter_id", alarm.getParameterId());
            alarms.add(alarmObj);
        }

        alarmWindowObj.put("window_start", element.getWindowStart());
        alarmWindowObj.put("window_end", element.getWindowEnd());
        alarmWindowObj.put("alarms", alarms);
        return alarmWindowObj.toJSONString().getBytes();

    }
}
