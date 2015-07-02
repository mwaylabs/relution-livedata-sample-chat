var express = require('mcap/express.js');
var app = express();
var routes = require('./routes/index');
var users = require('./routes/users');
var user = require('./routes/user');
var messages = require('./routes/messages');

app.use(express.bodyParser());
app.use('/', routes);
app.use('/api/messages', messages);
app.use('/api/users', users);
app.use('/api/user', user);
app.listen();
