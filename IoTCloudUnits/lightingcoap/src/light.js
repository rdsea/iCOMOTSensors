//Emulating a single light which is a coap server listen for command.

const coap  = require('coap');
//var light = null;
module.exports = {
    initialize: function (address, port, name) {
      var light = coap.createServer({
		      multicastAddress: address
	    });

      // Create servers
      light.listen(port, function() {
	       console.log('Light '+name+ ' is ready')
       })
       light.on('request', function(msg, res) {
	        console.log(name +' has received message')
	         res.end('Ok')
         })
    return light;
   }
   //destroy: function() {
  //   if (light !=null) {
  //     light.close();
  //   }
  // }
}
