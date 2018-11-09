var express = require('express');
var app = express();
var route = require('./route.js');
var session = require('express-session');
var mongodb = require('mongodb');
var mongo = require('./config/mongo-connect');
var fs = require('fs');

//GraphQL start here ------

var express_graphql = require('express-graphql');
var {buildSchema} = require('graphql');

var schema = buildSchema(`
	type Query {
		user(fullname: String!): Person,
		users: [Person]
	},

	type Person {
	    fullname: String,
	    email: String,
	    role: String,
	    authority: Authority 
  	}

  	type Authority {
  		read: Int,
  		create: Int,
  		update: Int,
  		delete: Int
  	}
`);

var users = [];
mongo.mongoUser("find", {}, function(response) {
	for(var i = 0; i < response.length; i++)
		users.push(response[i]);
});

var getUser = function(args) { // return a single user based on id
	var userFullname = args.fullname;
  	for(var i = 0; i < users.length; i++) {
	  	if(userFullname == users[i].fullname) {
	  		return users[i];
	  	}
	}
}

var getUsers = function() {
	return users;
}

var root = {
	user: getUser,
	users: getUsers
};

app.use('/graphql', express_graphql({
	schema: schema,
	rootValue: root,
	graphiql: true
}));

//GraphQL end here ------

app.use(session({secret: 'kuda'}));

app.use('/', route);

app.use(express.static(__dirname + '/public',{ redirect : false }));

var server = app.listen(3000, function () {
	var port = server.address().port;

  	console.log('App listening at port:', port);
});