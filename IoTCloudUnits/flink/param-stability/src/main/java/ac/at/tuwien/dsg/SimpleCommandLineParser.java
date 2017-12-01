package ac.at.tuwien.dsg;

import org.apache.commons.cli.*;

public class SimpleCommandLineParser {
    private Options options;
    private CommandLine cmd;

    public SimpleCommandLineParser(){
        this.options = new Options();
        Option help = new Option("h","help", false, "print usage");
        this.options.addOption(help);

        Option mqttURI = new Option("m","mqtt", true, "MQTT server URI, defaults to 'tcp://localhost:1883'");
        Option mqttTopics = new Option("t","topics", true, "A comma separated list of topics" );
        Option mqttClientId = new Option("i","id", true, "MQTT client ID");
        Option deviation = new Option("d", "deviation", true,
                "a number between 1-99 representing acceptable deviation of parameter value");

        mqttClientId.setRequired(true);
        mqttTopics.setRequired(true);

        this.options.addOption(mqttClientId);
        this.options.addOption(mqttTopics);
        this.options.addOption(mqttURI);
        this.options.addOption(deviation);

        this.cmd = null;
    }

    public void parseArgs(String[] args){
        CommandLineParser parser = new DefaultParser();
        HelpFormatter formatter = new HelpFormatter();

        try{
            this.cmd = parser.parse(this.options, args);
        }catch(ParseException e){
            System.out.println(e.getMessage());
            formatter.printHelp("usage", options);
            System.exit(1);
            return;
        }

        if(this.cmd.hasOption("help")){
            formatter.printHelp("usage", options);
            System.exit(0);
            return;
        }
    }

    public String getUri(){
        return cmd.getOptionValue("mqtt", "tcp://localhost:1883");
    }

    public String[] getTopics(){
        return cmd.getOptionValue("topics").split(",");
    }

    public String getClientId(){
        return cmd.getOptionValue("id");
    }

    public int getDeviation(){
        return Integer.parseInt(cmd.getOptionValue("deviation"));
    }


}
