package container.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.log4j.Logger;
import org.springframework.core.io.Resource;

public class ConfigReader {
	
	private static final Logger LOGGER = Logger.getLogger(ConfigReader.class);
	
	public static String getProperty(Resource from, String key) {
		LOGGER.info(String.format("Reading property for %s.", key));
		String value = "";
		try {
			InputStream is = from.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(is));

			String line;
			while ((line = br.readLine()) != null) {
				if (line.startsWith(key)) {
					value = line.split(":")[1];
					value = value.trim();
				}
			}
			br.close();
		} catch (IOException e) {
			e.printStackTrace();
			LOGGER.error("No .conf file found!");
		}
		if("".equals(value)){
			throw new IllegalArgumentException(String.format("No value available for key:%s", key));
		}
		LOGGER.info(String.format("Found property %s for key %s.", value, key));
		return value;
	}
}
