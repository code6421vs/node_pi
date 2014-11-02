// Get net module
var net = require('net');
 // Remove from array
 Array.prototype.remove = function(e) {
 	for (var i = 0; i < this.length; i++) {
 		if (e == this[i]) { return this.splice(i, 1); }
 	}
 };
 // Our server class
 exports.BroadcastServer = function(port) {
 	var Me = this;
 // Private variables
 var subscribers = [];
 var server;
 // Private: initialization method
 var init = function() {
 	server = net.createServer(onNewSubscriber);
 	server.listen(port);
 	console.log("\nListening on port " + port + "\n\n");
 	return Me;
 };
 // Private: called when new client connects
 var onNewSubscriber = function(stream) {
 // Initialize stream
 stream.setTimeout(0);
 stream.setEncoding('utf8');
 // When subscriber connects
 stream.on('connect', function() {
 	subscribers.push(stream);
 	stream.write("~~~~~~~~ WELCOME TO THE TIME SERVER ~~~~~~\n");
 	stream.write('You are subscriber #' + subscribers.length + "\n");
 	stream.write("\n\n");
 	console.log('New subscriber: ' + subscribers.length + " total.\n")
 });
 // When subscriber disconnects
 stream.on('end', function() {
 	subscribers.remove(stream);
 	stream.end();
 	console.log('Subscriber left: ' + subscribers.length + " total.\n");
 });
};
 // Public: method to push message to all clients
 Me.broadcastMessage = function(msg) {
 	subscribers.forEach(function(s) {
 		s.write(msg + "\n");
 	});
 };
 // initialize and return self
 return init();
};
