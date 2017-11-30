package ac.at.tuwien.dsg.functions;

import ac.at.tuwien.dsg.models.BTSParam;
import ac.at.tuwien.dsg.models.UnstableParam;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.flink.api.java.tuple.Tuple;
import org.apache.flink.streaming.api.functions.windowing.WindowFunction;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.util.Collector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class StandardDeviationFunction  implements WindowFunction<BTSParam, UnstableParam, Tuple, TimeWindow>{

    private int percentage;
    Logger logger  = LoggerFactory.getLogger(this.getClass());

    @Override
    public void apply(Tuple key, TimeWindow window, Iterable<BTSParam> input, Collector<UnstableParam> out) throws Exception {
        DescriptiveStatistics stats = new DescriptiveStatistics();
        UnstableParam unstableParam = new UnstableParam();

        for(BTSParam param: input){
            stats.addValue(param.getValue());
        }

        double deviation = stats.getStandardDeviation();
        double mean = stats.getMean();
        logger.info("window_start: "+window.getStart()+" param: "+key.getField(0)+" deviation: "+deviation);


        unstableParam.setDeviation(deviation);
        unstableParam.setParameterId(key.getField(0));
        unstableParam.setTimestamp(window.getStart());

        if(deviation > (mean/100)*this.percentage){
            logger.warn("unstable param found "+key.getField(0));
            out.collect(unstableParam);
        }

    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        logger.info("instability set at "+percentage+" percent");
        this.percentage = percentage;
    }
}
