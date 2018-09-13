var coap = require('coap');
module.exports = {
    publish: function (endpoint, multicast, resource, msg) {
      console.log("Send the body "+msg)
      if (multicast==true) {
        var client = coap.request({
        	host: endpoint, multicast: true, multicastTimeout: 3000
        });
        client.write(msg);
        client.on('response', function(res) {
          res.pipe(process.stdout);
        })
        client.end();
      }
      else {
        var uri = endpoint+"/"+resource;
        console.log("Send data to "+uri)
        var client = coap.request(uri)
        client.write(msg);
        client.on('response', function(res) {
          res.pipe(process.stdout);
        })
        client.end();
    }
  }
}
