//Emulating a single light which is a coap server listen for command.
var fs = require('fs');
const coap  = require('coap');
var control_module = null;
module.exports = {
    initialize: function (address, port, name,control_config_file) {
      var light = coap.createServer({
		      multicastAddress: address
	    });
      var control_config = JSON.parse(fs.readFileSync(control_config_file, 'utf8'));
      // Create servers
      light.listen(port, function() {
	       console.log('Light '+name+ ' is ready');
         control_module=require(control_config.file);
       })
       light.on('request', function(msg, res) {
	        console.log(name +' has received message');
          var arr = new Uint8Array(msg.payload);
          var command = String.fromCharCode.apply(String, arr);
          //just for logging
          console.log(command);
          //call user-define control function
          var result =control_module[control_config.control_function](command);
	        res.end(result)
         })
    return light;
   }
}
