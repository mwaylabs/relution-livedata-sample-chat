'use strict';

var bikini = require('mcap/bikini.js');
var datasync = require('mcap/datasync.js');
var push = require('mcap/push.js');
var express = require('express');
var app = express();

// messages CRUD interface
var options = {
	entity: 'messages',
	type: {
		container: 'relutionLiveDataSampleChat MetaModelContainer',
		model: 'message'
	},
	idAttribute: '_id',
	backend: new datasync.Backend({
		// push on create
		create: function createMessage(message, callback) {
			var result = callback(null, message);
			if(message.receiverUuid) {
				push.postPushNotification({
					message: message.senderName + ": " + message.message,
					badge: '+1',
					// filter on receiver's devices only
					deviceFilter: new com.mwaysolutions.gofer2.filter.domain.StringFilter(com.mwaysolutions.gofer2.push.domain.Device.PROPERTY_USER, message.receiverUuid)
				});
			}
			return result;
		},
		update: function updateMessage(message, callback) {
			return callback(null, message);
		},
		patch: function patchMessage(message, callback) {
			return callback(null, message);
		},
		delete: function deleteMessage(message, callback) {
			return callback(null, message);
		}
	})
};
app.use('/', bikini.middleware(options));

module.exports = app;
