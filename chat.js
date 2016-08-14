'use strict';

var express = require('express'); // do not change this line
var socket = require('socket.io'); // do not change this line
var assert = require('assert'); // do not change this line

var server = express();

server.use('/', express.static(__dirname + '/'));

var io = socket(server.listen(process.env.PORT || 8080)); // do not change this line

var objectClients = {};

io.on('connection', function(socketHandle) {
	// Assign a random id to the socket and store the socketHandle in the
	//	 objectClients variable - example: '9T1P4pUQ'
	socketHandle.strIdent = Math.random().toString(36).substr(2, 8);

	objectClients[socketHandle.strIdent] = {
		'strIdent': socketHandle.strIdent,
		'socketHandle': socketHandle
	};

	console.log('Log: Client with id ' + socketHandle.strIdent + ' connected.');

	// Send the new client the 'hello' event, containing the assigned id
	//	 - example: { 'id':'9T1P4pUQ' }
	objectClients[socketHandle.strIdent].socketHandle
		.emit( 'hello', { 'id': socketHandle.strIdent } );

	// Send everyone the 'clients' event, contianing an array of the connected clients
	//	 - example: { 'array':['GxwYr9Uz','9T1P4pUQ'] }

	var aList = getClientList();
	console.log('Log: list: ' + aList + ' length: ' + aList.length);

	for (var strIdent in objectClients) {
		objectClients[strIdent].socketHandle
			.emit('clients', {'array': aList});
	}

	// Send everyone the 'message' event, containing a message that a new client connected
	//	 - example: { 'from':'server', 'to':'everyone', 'message':'9T1P4pUQ connected' }
	for (var strIdent in objectClients) {
		objectClients[strIdent].socketHandle
			.emit('message', {
				'from': 'server',
				'to': 'everyone',
				'message': socketHandle.strIdent + ' connected' }
			);
	}


	socketHandle.on('message', function(objectData) {
		// if the message should be recevied by everyone, broadcast it accordingly
		// if the message has a single target, send it to this target as well as
		//	to the origin
		console.log('Log: \'message\': from: ' + socketHandle.strIdent
			+ ', to: ' + objectData.to + ', message: ' + objectData.message);

		if(objectData.to === 'everyone') {
			// BROADCAST:
			for (var strIdent in objectClients) {
				objectClients[strIdent].socketHandle
					.emit('message', {
						'from': socketHandle.strIdent,
						'to': 'everyone',
						'message': objectData.message }
					);
			}
		}
		else {
			//send to single target and send back to origin
				objectClients[objectData.to].socketHandle
					.emit('message', {
						'from': socketHandle.strIdent,
						'to': objectData.to,
						'message': objectData.message }
					);
					objectClients[socketHandle.strIdent].socketHandle
						.emit('message', {
							'from': socketHandle.strIdent,
							'to': objectData.to,
							'message': objectData.message }
						);
		} //end else

	});




	socketHandle.on('disconnect', function() {
		console.log('disconnected client: ' + socketHandle.strIdent);

		 // Remove the disconnected client from the objectClients variable
		 delete objectClients[socketHandle.strIdent];

		 aList = getClientList();
		 console.log('Log: disconnected newlist: ' + aList + ' length: ' + aList.length);

		 // Send everyone the 'clients' event, contianing an array of the connected clients
		 //	 - example: { 'array':['GxwYr9Uz'] }

		 for (var strIdent in objectClients) {
			 objectClients[strIdent].socketHandle
				 .emit('clients', {'array': aList});
		 }

		// Send everyone the 'message' event, containing a message that an existing client disconnected
		//	 - example: { 'from':'server', 'to':'everyone', 'message':'9T1P4pUQ disconnected' }
		// BROADCAST:
		for (var strIdent in objectClients) {
			objectClients[strIdent].socketHandle
				.emit('message', {
					'from': 'server',
					'to': 'everyone',
					'message': socketHandle.strIdent + ' disconnected'}
				);
		}

	});
});


console.log('go ahead and open "http://localhost:8080/chat.html" in your browser');




//
// gets a list of connected clients
//
var getClientList = function() {
	var list = [];
	for (var strIdent in objectClients) {
		list.push(objectClients[strIdent].strIdent)
	}
	return list;
};
