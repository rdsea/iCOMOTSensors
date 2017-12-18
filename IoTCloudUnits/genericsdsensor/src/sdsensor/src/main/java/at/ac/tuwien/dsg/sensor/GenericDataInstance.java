package at.ac.tuwien.dsg.sensor;

import org.json.simple.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class GenericDataInstance {

	private String sensorId;
	private List<Record> records;

	private boolean testMode;

	public GenericDataInstance(String id, List records, boolean testMode){
		this.sensorId = id;
		this.records = records;
		this.testMode = testMode;
	}

	public GenericDataInstance(String id, List records){
	    this(id, records, false);
    }

	public String getJSON() {
		JSONObject object = new JSONObject();

		for (Record r : this.records){
			object.put(r.key, r.value);
		}

		object.put("id", sensorId);

		if(this.testMode){
		    object.put("departure", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()).toString());
        }

		return object.toJSONString();
	}

	public static class Record{

		private String key;
		private String value;

		public Record (String key, String value){
			this.key = key;
			this.value = value;
		}

		public String getKey(){
			return this.key;
		}

		public String getValue(){
			return this.value;
		}

	}
	public static void main (String [] args){
		System.out.println("test");
	}

}
