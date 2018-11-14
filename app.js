var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var route = require('./route.js');
var session = require('express-session');
var mongodb = require('mongodb');
var mongo = require('./src/mongo-connect');
var fs = require('fs');
var express_graphql = require('express-graphql');
var graphvar = require('./src/graphql');
var middle = require('./src/middleware');

app.use('/graphql', express_graphql({
	schema: graphvar.schema,
	rootValue: graphvar.root,
	graphiql: true
}));

app.use(session({secret: 'kuda'}));

app.use(cookieParser());

app.all('*', middle.verifyToken);

app.use('/', route);

app.use(express.static(__dirname + '/public',{ redirect : false }));
app.use(express.static(__dirname + '/plugin',{ redirect : false }));

var server = app.listen(3000, function () {
	var port = server.address().port;

  	console.log('App listening at port:', port);
});