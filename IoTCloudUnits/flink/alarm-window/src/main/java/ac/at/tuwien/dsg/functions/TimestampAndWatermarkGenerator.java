package ac.at.tuwien.dsg.functions;

import ac.at.tuwien.dsg.models.BTSAlarm;
import org.apache.flink.streaming.api.functions.AssignerWithPeriodicWatermarks;
import org.apache.flink.streaming.api.watermark.Watermark;

import javax.annotation.Nullable;

public class TimestampAndWatermarkGenerator implements AssignerWithPeriodicWatermarks<BTSAlarm> {
    private long currentMaxTimestamp;

    @Nullable
    @Override
    public Watermark getCurrentWatermark() {
        return new Watermark(this.currentMaxTimestamp);
    }

    @Override
    public long extractTimestamp(BTSAlarm element, long previousElementTimestamp) {
        if(element.getEndTime().getTime() > this.currentMaxTimestamp)
            this.currentMaxTimestamp = element.getEndTime().getTime();
        return element.getEndTime().getTime();
    }
}
