var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyACM0", {
  baudrate:19200
},false);

serialPort.open(function() {
   console.log("opend.");
   var buff = new Buffer(15);
  
   for(var i = 0; i < 15; i+=3) {
      buff[i] = 0x00;
      buff[i+1] = 0xFF;
      buff[i+2] = 0x00;
   }
   serialPort.write(buff, function(err,results) {
       console.log("err : " + err);
       console.log("results : " + results);
   });
});

