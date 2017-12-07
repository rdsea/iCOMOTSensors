package ac.at.tuwien.dsg;

import com.google.cloud.bigquery.*;
import org.apache.flink.streaming.api.functions.sink.SinkFunction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BigQuerySink implements SinkFunction<IBigQuerySinkObject> {
    private BigQuery bigQuery;
    private Dataset dataset;
    private Table table;

    Logger logger = LoggerFactory.getLogger(this.getClass());

    public BigQuerySink(String datasetId){
        this.bigQuery = BigQueryOptions.getDefaultInstance().getService();
        this.dataset = this.bigQuery.getDataset(datasetId);
        if(this.dataset == null){
            logger.info("dataset "+datasetId+" does not exist, creating dataset "+datasetId);
            DatasetInfo datasetInfo = DatasetInfo.newBuilder(datasetId).build();
            this.dataset = this.bigQuery.create(datasetInfo);
        }
        logger.info("obtained instance of dataset "+datasetId);
    }

    public void createTable(Schema schema, String tableId){
        TableDefinition tableDefinition = StandardTableDefinition.newBuilder().setSchema(schema).build();
        this.table = this.dataset.get(tableId);
        if(this.table == null){
            logger.info("table "+tableId+" does not exist, creating table "+tableId);
            this.table = this.dataset.create(tableId, tableDefinition);
        }
        logger.info("obtained instance of table "+tableId);
    }

    @Override
    public void invoke(IBigQuerySinkObject value) throws Exception {
        try{
            InsertAllResponse res =  this.table.insert(value.getRowData());
        }catch(Exception e){
            logger.error("failed to insert sink object to bigQuery");
            logger.error(e.getMessage());
        }
    }
}
