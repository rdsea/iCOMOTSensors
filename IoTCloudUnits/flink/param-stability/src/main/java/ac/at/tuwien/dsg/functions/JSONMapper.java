package ac.at.tuwien.dsg.functions;

import ac.at.tuwien.dsg.models.BTSParam;
import org.apache.flink.api.common.functions.FlatMapFunction;
import org.apache.flink.util.Collector;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JSONMapper implements FlatMapFunction<String, BTSParam> {
    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void flatMap(String value, Collector<BTSParam> out) throws Exception {
        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(value);
        BTSParam param = new BTSParam();

        try{
            param.setId(Long.parseLong((String) jsonObject.get("id")));
            param.setParameterId(Long.parseLong((String) jsonObject.get("parameter_id")));
            param.setStationId(Long.parseLong((String) jsonObject.get("station_id")));
            param.setValue(Double.parseDouble((String) jsonObject.get("value")));
            param.setReadingTimeFromString((String) jsonObject.get("reading_time"));
            logger.info("successfully parsed BTS param");
        }catch(Exception e){
            logger.error("could not parse received json: "+value);
            logger.error(e.getMessage());
            param = null;
        }
        if(param != null) out.collect(param);
    }
}
