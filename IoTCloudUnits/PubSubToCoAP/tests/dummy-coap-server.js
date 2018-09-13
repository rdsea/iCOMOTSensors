const coap    = require('coap')
    , server  = coap.createServer()

server.on('request', function(req, res) {
  console.log("Request from "+req.url);
  console.log("CoAP server receives")
  var arr = new Uint8Array(req.payload);
  var str = String.fromCharCode.apply(String, arr);
  console.log(str)
  res.end('OK');
})

server.listen(function() {
  console.log('Dummy CoAP Server started')
})
