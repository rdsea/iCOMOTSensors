package sensor;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Level;
import org.apache.log4j.Logger;

import sensor.GenericDataInstance.Record;

public class DataProvider implements Runnable {

    public static DataProvider provider;
    private static final Object lock = new Object();
    private static Logger LOGGER = Logger.getLogger(DataProvider.class);

    static {
        provider = new DataProvider();
    }

    public static DataProvider getProvider() {
////        synchronized (lock) {
//            if (provider == null) {
//                provider = new DataProvider();
//            }
        return provider;
//        }
    }
    private Stack<GenericDataInstance> dataInstances = new Stack<GenericDataInstance>();

    public void run() {

        if (dataInstances.size() == 0) {
            LOGGER.info(String.format("Reading csv file"));
            InputStreamReader reader = new InputStreamReader(DataProvider.class.getClassLoader().getResourceAsStream("data.csv"));
            BufferedReader br = new BufferedReader(reader);

            try {

                String firstLine = br.readLine();
                String headers[] = firstLine.split(",");

                String line;
                while ((line = br.readLine()) != null) {
                    String[] split = line.split(",");
                    List<Record> records = new ArrayList<Record>();
                    for (int i = 1; i < split.length; i++) {
                        Record r = new Record(headers[i], split[i]);
                        records.add(r);
                    }

                    GenericDataInstance ginst = new GenericDataInstance(split[0], records);

                    dataInstances.push(ginst);
                }
                br.close();
            } catch (IOException e) {
                LOGGER.error(e.getMessage(), e);
                e.printStackTrace();
            }
        } else {
            LOGGER.info(String.format("Data stack not empty yet"));
        }
//            }
//        };
//        refreshDataTimer = new Timer(true);
//        refreshDataTimer.schedule(task, 0, 1000);
    }

    private DataProvider() {
    }
     
    public GenericDataInstance getNextInstance() {
        // FIXME: reading data in reverse order
        if (this.dataInstances.isEmpty()) {
            return null;
        } else {
            return this.dataInstances.pop();
        }
    }
}
