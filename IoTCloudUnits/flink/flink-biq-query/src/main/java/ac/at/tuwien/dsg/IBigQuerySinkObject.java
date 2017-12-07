package ac.at.tuwien.dsg;

import com.google.cloud.bigquery.InsertAllRequest;

import java.util.List;

public interface IBigQuerySinkObject {
    public List<InsertAllRequest.RowToInsert> getRowData();
}
