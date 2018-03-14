'use strict';

var express = require('express');
var app = express();
var routes = require('./routes.js');
var dbConfig = require('./dbConfig.js');
var jsonParser = require('body-parser').json;
var logger = require('morgan');
var mongoose = require('mongoose');

mongoose.connect(dbConfig.connectionstring);

var db = mongoose.connection;

db.on('error', function(err){
	console.error('Connection error:', err);
});

db.once('open', function(){
	console.log('Database connection successful');
});

app.use(logger('dev'));
app.use(jsonParser());
app.disable('view cache');

app.use(jsonParser({limit: '1mb'}));

app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type');
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE');
		return res.status(200).json({});
	}
	next();
});

app.use("/", routes);

// Catch 404
app.use(function(req, res, next){
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// Error handler
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

var port = process.env.PORT || 3004;

app.listen(port, function(){
	console.log('Express server is listening on port', port);
});
