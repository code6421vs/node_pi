var SerialPort = require("serialport").SerialPort;
var url = require('url');

function sendData(hexStr) {
    var serialPort = new SerialPort("/dev/ttyACM0", {
        baudrate: 19200
    }, false);

    serialPort.open(function () {
        sys.puts("opend.")     
        var buff = new Buffer(hexStr, "raw");
        serialPort.write(buff, function (err, results) {
            sys.puts("results: " + results);
            serialPort.close();
        })

    });
}

var sys = require("sys"),
my_http = require("http");
my_http.createServer(function (request, response) {
    response.writeHeader(200, { "Content-Type": "text/plain" });    
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    sendData(query);
    response.write(query);
    response.end();
}).listen(8080);
sys.puts("Server Running on 8080");





