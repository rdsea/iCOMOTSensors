package ac.at.tuwien.dsg.functions;

import ac.at.tuwien.dsg.models.BTSParam;
import org.apache.flink.streaming.api.functions.AssignerWithPeriodicWatermarks;
import org.apache.flink.streaming.api.watermark.Watermark;

import javax.annotation.Nullable;

public class TimestampAndWatermarkGenerator implements AssignerWithPeriodicWatermarks<BTSParam> {
    private long currentMaxTimestamp;

    @Nullable
    @Override
    public Watermark getCurrentWatermark() {
        return new Watermark(this.currentMaxTimestamp);
    }

    @Override
    public long extractTimestamp(BTSParam element, long previousElementTimestamp) {
        if(element.getReadingTime().getTime() > this.currentMaxTimestamp)
            this.currentMaxTimestamp = element.getReadingTime().getTime();
        return element.getReadingTime().getTime();
    }
}
