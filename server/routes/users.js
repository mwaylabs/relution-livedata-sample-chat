'use strict';

var __mcap_security = require('mcap/security.js');
var express = require('express');
var app = express();

// lists all users of current user except of the user herself.
app.get('/', function( req, res ) {
	var user = __mcap_security.getCurrentUser(com.mwaysolutions.gofer2.security.domain.User.PROPERTY_UUID, com.mwaysolutions.gofer2.security.domain.User.PROPERTY_ORGANIZATION_UUID);
	var users = __mcap_security.getUsersByExample({
		organizationUuid: user.organizationUuid
	});
	for(var i = 0; i < users.length; ++i) {
		if(users[i].uuid == user.uuid) {
			// need JavaScript array for splice to work,
			// like arguments, users here is a build-in
			users = Array.prototype.slice.call(users);
			users.splice(i, 1);
			break;
		}
	}
	res.json(users);
});

module.exports = app;
