var template =  {
  "remoteDataLocation": "http://localhost:8080",
  "data": 'bigQuery',
  "brokers": [
    {
      "host": "localhost",
      "port": 1883,
      "clientId": "testclient1",
      "username": 'xxx',
      "password": 'xxx',
      "topics": [
        "test1",
        "test2"
      ]
    },
    {
      "host": "localhost",
      "port": 1883,
      "clientId": "testclient2",
      "topics": [
        "test3",
        "test4"
      ]
    }
  ]
}

export var bigQueryTemplate = {
  dataset: 'datasetId',
  tables: [
    {
      id: 'tableId',
      topics: [
        'topic1',
        'topic2',
      ]
    }
  ]
}


export default template;