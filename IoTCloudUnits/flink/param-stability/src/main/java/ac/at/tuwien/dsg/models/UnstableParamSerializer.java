package ac.at.tuwien.dsg.models;

import ac.at.tuwien.dsg.models.UnstableParam;
import org.apache.flink.streaming.util.serialization.SerializationSchema;
import org.json.simple.JSONObject;

public class UnstableParamSerializer implements SerializationSchema<UnstableParam> {
    @Override
    public byte[] serialize(UnstableParam element) {
        JSONObject object = new JSONObject();
        object.put("param_id", element.getParameterId());
        object.put("deviation", element.getDeviation());
        object.put("start_time", element.getStart());
        object.put("end_time", element.getEnd());
        return object.toJSONString().getBytes();
    }
}
