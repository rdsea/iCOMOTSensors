//This is just an example of user-defined controller for the light example
//the assumption is that this module is defined by the user to enable
//low level control. The user just follows the convention
module.exports = {
    //function control is used to control the light, json as input
    control: function (command) {
     console.log("To control the light");
     console.log("Performing "+command);
      var result ={
        "message":"OK"
      }
      return JSON.stringify(result);
   }
}
