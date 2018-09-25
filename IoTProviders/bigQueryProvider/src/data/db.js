import mongoose from 'mongoose';


const MongoClient = require("mongodb").MongoClient;
let MONGODB_URL = process.env.MONGODB_URL;

const DB_NAME = "sinc";
const COLLECTION = "bigquery";

// an environment variable can also be passed
if(process.env.MONGODB_URL){
    MONGODB_URL = process.env.MONGODB_URL
}

let client = null;
let db = null;

MongoClient.connect(MONGODB_URL, {useNewUrlParser: true}).then((c) => {
    client = c;
    db = client.db(DB_NAME);
});

export function insert(doc){
    let collection = db.collection(COLLECTION);
    console.log(`inserting document ${JSON.stringify(doc)}`);
    return collection.insert(doc).then((res) => {
        console.log(`successfully inserted document ${JSON.stringify(doc)}`);
        return doc;
    }).catch((err) => {
        console.error(err);
    });
}

export function find(query){
    let collection = db.collection(COLLECTION);
    console.log(`finding one documentof ${JSON.stringify(query)}`);
    return collection.find(query).toArray().then((docs) => {
        console.log(`successfully found ${docs.length} results for ${query}`);
        return docs;
    }).catch((err) => {
        console.error(err);
        return [];
    })
}

export function findOne(query){
    let collection = db.collection(COLLECTION);
    return collection.findOne(query).then((doc) => {
        return doc;
    }).catch((err) => {
        console.error(err);
        return null;
    })
}

export function update(query, update, options){
    let collection = db.collection(COLLECTION);
    return collection.updateMany(query, update, options).then((res) => {
        console.log(`successfully updated ${res.modifiedCount} matched with ${res.matchedCount}`);
    }).catch((err) => {
        console.error(err);
    })
}


export function remove(query, options){
    let collection = db.collection(COLLECTION);
    return collection.deleteMany(query).then((res) => {
        console.log(`successfully removed ${res.deletedCount} entries from db`);
    }).catch((err) => {
        console.error(err);
    })
}
