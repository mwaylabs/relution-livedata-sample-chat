'use strict';

var __mcap_security = require('mcap/security.js');
var express = require('express');
var app = express();

// lists all users of current user except of the user herself.
app.get('/', function( req, res ) {
  var user = __mcap_security.getCurrentUser();
	res.json(user);
});

module.exports = app;
