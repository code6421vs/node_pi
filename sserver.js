var base = 16;

function send(buff, sp) {
  for(var i = 0; i < 15; i+=3) {
     buff[i] = 0x00;
     buff[i+1] = base;
     buff[i+2] = 0x00;
  }
  base += 5;
  sp.write(buff, function(err, results){
     console.log("results :" + results);
     if(base > 200)
        base = 5;
     setTimeout(function(){
       send(buff,sp);
     } ,50);
  });
}


var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyACM0", {
  baudrate:19200
},false);

serialPort.open(function() {
   console.log("opend.");
   
   var buff = new Buffer(15);
   send(buff,serialPort);   

});

