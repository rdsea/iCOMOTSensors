package ac.at.tuwien.dsg.functions;

import ac.at.tuwien.dsg.models.AlarmWindow;
import ac.at.tuwien.dsg.models.BTSAlarm;
import org.apache.flink.api.java.tuple.Tuple;
import org.apache.flink.streaming.api.functions.windowing.AllWindowFunction;
import org.apache.flink.streaming.api.functions.windowing.WindowFunction;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.util.Collector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.LinkedList;

public class AggregatorFunction implements AllWindowFunction<BTSAlarm,AlarmWindow,TimeWindow> {
    @Override
    public void apply(TimeWindow window, Iterable<BTSAlarm> input, Collector<AlarmWindow> out) throws Exception {
        Logger logger  = LoggerFactory.getLogger(this.getClass());

        AlarmWindow alarmWindow = new AlarmWindow();
        LinkedList<BTSAlarm> alarmList = new LinkedList<>();
        logger.info("checking alarms at window "+window.getStart());

        for(BTSAlarm alarm: input){
            alarmList.add(alarm);
        }

        alarmWindow.setAlarms(alarmList);
        alarmWindow.setWindowStart(window.getStart());
        alarmWindow.setWindowEnd(window.getEnd());

        if(alarmList.size() > 1){
            logger.info(alarmList.size()+" alarms occurred at window "+window.getStart());
            out.collect(alarmWindow);
        }
    }

}
