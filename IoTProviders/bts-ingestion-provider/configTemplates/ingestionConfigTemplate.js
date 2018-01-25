var template =  {
  "remoteDataLocation": "localhost:8080",
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


export default template;