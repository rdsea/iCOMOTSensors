import bridge.KafkaBridge;
import org.apache.commons.cli.*;
import org.eclipse.paho.client.mqttv3.MqttException;

public class Main {
    public static void main(String[] args){
        Options options = new Options();
        Option help = new Option("h","help", false, "print usage");
        options.addOption(help);

        Option mqttURI = new Option("m","mqtt", true, "MQTT server URI, defaults to 'tcp://localhost:1883'");
        Option mqttTopics = new Option("t","mqtt-topics", true, "A comma separated list of topics, defaults to '#'" );
        Option mqttClientId = new Option("i","id", true, "MQTT client ID");
        mqttClientId.setRequired(true);

        Option kafkaURI = new Option("k","kafka", true, "A comma separated list of Kafka broker URIs, defaults to 'localhost:9092'");
        Option kafkaTopics = new Option("T","kafka-topics", true,"A comma separated list of topics");

        options.addOption(mqttClientId);
        options.addOption(mqttTopics);
        options.addOption(mqttURI);
        options.addOption(kafkaTopics);
        options.addOption(kafkaURI);

        CommandLineParser parser = new DefaultParser();
        HelpFormatter formatter = new HelpFormatter();
        CommandLine cmd = null;

        try{
            cmd = parser.parse(options, args);
        }catch(ParseException e){
            System.out.println(e.getMessage());
            formatter.printHelp("usage", options);
            System.exit(1);
            return;
        }

        if(cmd.hasOption("help")){
            formatter.printHelp("usage", options);
            System.exit(0);
            return;
        }

        String[] mTopics = cmd.getOptionValue("mqtt-topics", "#").split(",");
        String[] kTopics = new String[0];
        if(cmd.hasOption("kafka-topics")){
            kTopics = cmd.getOptionValue("kafka-topics").split(",");
        }

        KafkaBridge bridge = new KafkaBridge();
        try {
            bridge.connect(cmd.getOptionValue("mqtt", "tcp://localhost:1883"), cmd.getOptionValue("id"));
            bridge.subscribe(mTopics);
            bridge.connectKafka(cmd.getOptionValue("mqtt", "localhost:9092"), kTopics);
        } catch (MqttException e) {
            e.printStackTrace();
        }

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            bridge.stop();
        }));
    }
}
