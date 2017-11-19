package at.ac.tuwien.dsg.sensor;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import org.apache.log4j.Logger;

import at.ac.tuwien.dsg.sensor.GenericDataInstance.Record;



public class DataProvider implements Runnable {

    public static DataProvider provider;
    private static final Object lock = new Object();
    private static Logger LOGGER = Logger.getLogger(DataProvider.class);
    private static String dataFile;
    private static boolean testMode = false;

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
    public static DataProvider getProvider(String file) {
      dataFile = file;
      return provider;
    }

    public static void setTestMode(boolean test){
        testMode = test;
    }

    private Stack<GenericDataInstance> dataInstances = new Stack<GenericDataInstance>();

    public void run() {

        if (dataInstances.size() == 0) {
            LOGGER.info(String.format("Reading csv file to load data"));
            //InputStreamReader reader = new InputStreamReader(new File(dataFile));//new InputStreamReader(DataProvider.class.getClassLoader().getResourceAsStream("/home/truong/myprojects/gittuwiendsg/iCOMOTSensors/java/genericsdsensor/src/sdsensor/target/data.csv"));
            try {
                BufferedReader br = new BufferedReader(new FileReader(dataFile));
                //need to use better library for CSV
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
                    if(testMode){
                        ginst = new GenericDataInstance(split[0], records, true);
                    }


                    dataInstances.push(ginst);
                }
                br.close();
            } catch (Exception e) {
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
