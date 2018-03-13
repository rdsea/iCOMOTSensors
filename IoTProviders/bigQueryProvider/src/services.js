import bigQuery from './bigQuery';
import * as db from './data/db';

export function createDataset(datasetId){
    let timestamp = (new Date()).getTime();
    console.log(`creating dataset ${datasetId}`);
    return bigQuery.createDataset(datasetId).then((dataset) => {
        console.log(`successfully created dataset ${datasetId}`);
        let doc = {
            datasetId: datasetId,
            createdAt: timestamp,
            tables: [],
        };
        return db.insert(doc);
    }).catch((err) => {
        return null;
    });
}

export function createTables(datasetId, tableConfigs){
    let dataset = bigQuery.dataset(datasetId);
    let newTables = [];
    tableConfigs.forEach((config) => {
        newTables.push(dataset.createTable(config.id, {schema: config.schema}));
    });

    console.log(`creating ${newTables.length} tables for dataset ${datasetId}`);
    return Promise.all(newTables).then(() => {
        console.log(`successfully created ${newTables.length} for dataset ${datasetId}`);
        console.log(tableConfigs)
        return db.update({ datasetId }, { $push:{ tables: {$each: tableConfigs} }});
    }).then((res) => {
        return { datasetId, tables: tableConfigs };
    }).catch((err) => { 
        return null;
    });
}

export function deleteDataset(datasetId){
    let dataset = bigQuery.dataset(datasetId)
    return dataset.getTables().then((tables) => {
        let deleteTables = [];
        console.log(`deleting ${tables[0].length} tables`);
        tables[0].forEach((table) => deleteTables.push(table.delete()));
        return Promise.all(deleteTables);
    }).then(() => dataset.delete()).then(() => {
        db.remove({datasetId});
    }).catch((err) => {
        console.error(`failed to delete dataset ${datasetId}`);
        console.error(err);
    });
}

export function getDataset(datasetId){
    if(!(datasetId)) return db.find().catch((err) =>  nul);
    return db.findOne({datasetId}).catch((err) => null);
}