package ac.at.tuwien.dsg.models;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class BTSParam {

    private long id;
    private double value;
    private long stationId;
    private long parameterId;
    private Date readingTime;

    public BTSParam(){

    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

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

    public long getParameterId() {
        return parameterId;
    }

    public void setParameterId(long parameterId) {
        this.parameterId = parameterId;
    }

    public Date getReadingTime(){
        return readingTime;
    }

    public void setReadingTime(Date readingTime){
        this.readingTime = readingTime;
    }

    public void setReadingTimeFromString(String s) throws ParseException {
        String pattern = "yyyy-MM-dd HH:mm:ss";
        SimpleDateFormat format = new SimpleDateFormat(pattern);
        this.readingTime = format.parse(s);
    }

    public String toString(){
        return "id:"+id+" stationId: "+stationId+" readingTime:" +readingTime;
    }
}
