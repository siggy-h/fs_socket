'use strict';

var express = require('express'); // do not change this line
var socket = require('socket.io'); // do not change this line
var assert = require('assert'); // do not change this line

var server = express();

server.use('/', express.static(__dirname + '/'));

var io = socket(server.listen(process.env.PORT || 8080)); // do not change this line

var objectClients = {};

io.on('connection', function(socketHandle) {
	// assign a random id to the socket and store the socketHandle in the objectClients variable - example: '9T1P4pUQ'
	// send the new client the 'hello' event, containing the assigned id - example: { 'id':'9T1P4pUQ' }
	// send everyone the 'clients' event, contianing an array of the connected clients - example: { 'array':['GxwYr9Uz','9T1P4pUQ'] }
	// send everyone the 'message' event, containing a message that a new client connected - example: { 'from':'server', 'to':'everyone', 'message':'9T1P4pUQ connected' }

	socketHandle.on('message', function(objectData) {
		// if the message should be recevied by everyone, broadcast it accordingly
		// if the message has a single target, send it to this target as well as to the origin
	});

	socketHandle.on('disconnect', function() {
		// remove the disconnected client from the objectClients variable
		// send everyone the 'clients' event, contianing an array of the connected clients - example: { 'array':['GxwYr9Uz'] }
		// send everyone the 'message' event, containing a message that an existing client disconnected - example: { 'from':'server', 'to':'everyone', 'message':'9T1P4pUQ disconnected' }
	});
});

console.log('go ahead and open "http://localhost:8080/chat.html" in your browser');