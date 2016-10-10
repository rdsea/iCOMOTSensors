package container.util;

public enum Properties {
	DEFAULT_CONFIG ("META-INF/default.config"),
	MAIN ("MainClass"),
	BEANS ("BeansDefinitions");
	
	private final String value;
	Properties (String value){
		this.value = value;
	}
	public String getValue() {
		return value;
	}
	
}
