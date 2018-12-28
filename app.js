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
var cors = require('cors');
var middle = require('./src/middleware');
var address = 'http://141.136.47.202';

app.use('/graphql', cors(), express_graphql({
	schema: graphvar.schema,
	rootValue: graphvar.root,
	graphiql: true
}));

app.use(cookieParser());

app.use(session({
  secret: 'kuda',
  cookie: { secure: false }
}))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', address+ ':3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, navPlugin');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.all('*', middle.verifyToken, middle.apiAuthCheck);

app.use('/', route);

app.use(express.static(__dirname + '/public',{ redirect : false }));
app.use(express.static(__dirname + '/plugin',{ redirect : false }));

var server = app.listen(3000, function () {
	var port = server.address().port;

  	console.log('App listening at port:', port);
});