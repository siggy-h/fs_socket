'use strict';

var express = require('express');
var socket = require('socket.io');
var assert = require('assert');

var server = express();

server.use('/', express.static(__dirname + '/'));

var io = socket(server.listen(process.env.PORT || 8080));

var objectElements = {};

io.on('connection', function(socketHandle) {
	console.log('client connected');

	for (var id in objectElements) {
		io.emit('drag', objectElements[id]);
	}

	socketHandle.on('drag', function(objectData) {
		console.log(objectData);

		assert(objectData.id !== undefined);
		assert(objectData.left !== undefined);
		assert(objectData.top !== undefined);

		objectElements[objectData.id] = objectData;

		io.emit('drag', objectData);
	});

	socketHandle.on('disconnect', function() {
		console.log('client disconnected');
	});
});

console.log('go ahead and open "http://localhost:8080/draggable.html" in your browser');