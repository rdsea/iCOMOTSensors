package ac.at.tuwien.dsg;


import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import java.io.FileReader;

public class ConfigParser {
    public String mqttUri = "tcp://localhost:1883";
    public String[] mqttTopics;
    public String mqttClientId;
    public int window;
    public String rabbitHost;
    public int rabbitPort;
    public String rabbitvHost;
    public String rabbitTopic;
    public String rabbitUser;
    public String rabbitPassword;

    public ConfigParser(String path){
        parse(path);
    }

    public void parse(String path){
        JSONParser parser = new JSONParser();

        try{
            JSONObject obj = (JSONObject) parser.parse(new FileReader(path));

            this.mqttUri = (String) obj.get("mqttUri");
            this.mqttClientId = (String) obj.get("mqttClientId");
            this.window = ((Long)obj.get("window")).intValue();
            this.rabbitHost = (String) obj.get("rabbitHost");
            this.rabbitPort = ((Long)obj.get("rabbitPort")).intValue();
            this.rabbitvHost = (String) obj.get("rabbitvHost");
            this.rabbitTopic = (String) obj.get("rabbitTopic");
            this.rabbitPassword = (String)obj.get("rabbitPassword");
            this.rabbitUser = (String) obj.get("rabbitUser");
            JSONArray array = (JSONArray) obj.get("mqttTopics");
            this.mqttTopics = new String[array.size()];
            for(int i = 0; i < array.size(); i++){
                mqttTopics[i] = (String) array.get(i);
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }
}
