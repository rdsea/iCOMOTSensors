package at.ac.tuwien.dsg.sensor;

import java.util.List;

public class GenericDataInstance {

	private String sensorId;
	private List<Record> records;

	public GenericDataInstance(String id, List records){
		this.sensorId = id;
		this.records = records;

	}

	public String getJSON() {

		StringBuilder json = new StringBuilder();
		json.append("{");
		json.append("\"id\":\"" + this.sensorId + "\",");

		for (Record r : this.records){
			json.append("\""+r.getKey()+"\":\"" + r.getValue() + "\",");

		}
		json.append("}");

		return json.toString();
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
