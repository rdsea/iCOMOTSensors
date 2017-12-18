package ac.at.tuwien.dsg.models;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class BTSAlarm {
    private long id;
    private long stationId;
    private long alarmId;
    private long parameterId;
    private Date startTime;
    private Date endTime;
    private double value;
    private double threshold;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getStationId() {
        return stationId;
    }

    public void setStationId(long stationId) {
        this.stationId = stationId;
    }

    public long getAlarmId() {
        return alarmId;
    }

    public void setAlarmId(long alarmId) {
        this.alarmId = alarmId;
    }

    public long getParameterId() {
        return parameterId;
    }

    public void setParameterId(long parameterId) {
        this.parameterId = parameterId;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public double getThreshold() {
        return threshold;
    }

    public void setThreshold(double threshold) {
        this.threshold = threshold;
    }

    public void setStartTimeFromString(String s) throws ParseException {
        String pattern = "yyyy-MM-dd HH:mm:ss";
        SimpleDateFormat format = new SimpleDateFormat(pattern);
        this.startTime = format.parse(s);
    }

    public void setEndTimeFromString(String s) throws ParseException {
        String pattern = "yyyy-MM-dd HH:mm:ss";
        SimpleDateFormat format = new SimpleDateFormat(pattern);
        this.endTime = format.parse(s);
    }
}
