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

var sys = require("sys"),
my_http = require("http");
my_http.createServer(function (request, response) {
    response.writeHeader(200, { "Content-Type": "text/plain" });    
    var url_parts = url.parse(request.url, true).query;
    if (url_parts && url_parts.data)
        sendData(url_parts.data);
    response.end();
}).listen(8080);

// get our custom broadcast server module
 var my = require('./broadcast_server');
 // Instantiate the server, passing the port to listen on
 var server = new my.BroadcastServer(7000);
 // Send time every 2 seconds
 setInterval(function() {
 var now = new Date();
 server.broadcastMessage(now.toTimeString());
 }, 2000);

 
sys.puts("Server Running on 8080");





