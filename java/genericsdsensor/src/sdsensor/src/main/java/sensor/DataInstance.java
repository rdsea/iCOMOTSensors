package sensor;

public class DataInstance {

	private String id;
	private String latitude;
	private String longitude;

	public DataInstance(String id, String latitude, String longitude) {
		this.id = id;
		this.latitude = latitude;
		this.longitude = longitude;
	}

	public String getJSON() {

		return "{\"id\":\"" + this.id + "\",\"latitude\":\"" + this.latitude + "\",\"longitude\":\"" + this.longitude + "\"}";
	}

}
