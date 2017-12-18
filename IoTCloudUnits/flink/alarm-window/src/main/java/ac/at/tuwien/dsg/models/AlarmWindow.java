package ac.at.tuwien.dsg.models;

import java.util.List;

public class AlarmWindow {
    public List<BTSAlarm> alarms;
    public long windowStart;
    public long windowEnd;

    public List<BTSAlarm> getAlarms() {
        return alarms;
    }

    public void setAlarms(List<BTSAlarm> alarms) {
        this.alarms = alarms;
    }

    public long getWindowStart() {
        return windowStart;
    }

    public void setWindowStart(long windowStart) {
        this.windowStart = windowStart;
    }

    public long getWindowEnd() {
        return windowEnd;
    }

    public void setWindowEnd(long windowEnd) {
        this.windowEnd = windowEnd;
    }

    public String toString(){
        return this.alarms.size()+" alarms occurred";
    }
}
