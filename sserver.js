var SerialPort = require("serialport").SerialPort;
var url = require('url');


var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;

function pad(str, len, pad, dir) {

    if (typeof(len) == "undefined") { var len = 0; }
    if (typeof(pad) == "undefined") { var pad = ' '; }
    if (typeof(dir) == "undefined") { var dir = STR_PAD_RIGHT; }

    if (len + 1 >= str.length) {

        switch (dir){

            case STR_PAD_LEFT:
                str = Array(len + 1 - str.length).join(pad) + str;
            break;

            case STR_PAD_BOTH:
                var right = Math.ceil((padlen = len - str.length) / 2);
                var left = padlen - right;
                str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
            break;

            default:
                str = str + Array(len + 1 - str.length).join(pad);
            break;

        } // switch

    }

    return str;

}

function sendData(hexStr) {
    var serialPort = new SerialPort("COM3", {
        baudrate: 19200
    }, false);

    serialPort.open(function () {
        sys.puts("opend.")
        try {
            hexStr = pad(hexStr, 130, "0");
            var buff = new Buffer(hexStr, "hex");
            serialPort.write(buff, function (err, results) {
                sys.puts("results: " + results);
                serialPort.close();
            });
        }
        catch (err) { }
    });
}

function listIPAddresses() {
   var os = require('os');

   var interfaces = os.networkInterfaces();
   var addresses = [];
   for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
      }
   }    
   return addresses;
}


var sys = require("sys"),
my_http = require("http");
my_http.createServer(function (request, response) {
    response.writeHeader(200, { "Content-Type": "text/plain" });    
    var url_parts = url.parse(request.url, true).query;
    if (url_parts && url_parts.data)
        sendData(url_parts.data);
    response.write("OK");
    response.end();
}).listen(8080);




 var dgram = require("dgram");
 var ips = listIPAddresses();

 var server = dgram.createSocket("udp4");

 server.on("message", function (msg, rinfo) {
   console.log("server got: " + msg + " from " +
     rinfo.address + ":" + rinfo.port);
   var replyMsg = "";
   for(var i = 0; i < ips.length; i++) {
       replyMsg += ips[i] +",";
   }
   var buff = new Buffer(replyMsg);
   console.log("data:" + buff +" size:" + buff.length);
   server.send(buff, 0, buff.length - 1, rinfo.port, rinfo.address);
 });

 server.on("listening", function () {
   var address = server.address();
   console.log("server listening " + address.address + ":" + address.port);
 });

 server.bind(15000);


sys.puts("Server Running on 8080");





