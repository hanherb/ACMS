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
		users: [Person],
		plugin(name: String!): Plugin,
		plugins: [Plugin]
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

  	type Plugin {
  		name: String,
  		status: Int
  	}
`);

var users = [];
mongo.mongoUser("find", {}, function(response) {
	for(var i = 0; i < response.length; i++)
		users.push(response[i]);
});

var plugins = [];
mongo.mongoPlugin("find", {}, function(response) {
	for(var i = 0; i < response.length; i++)
		plugins.push(response[i]);
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

var getPlugin = function(args) { // return a single user based on id
	var pluginName = args.name;
  	for(var i = 0; i < plugins.length; i++) {
	  	if(pluginName == plugins[i].name) {
	  		return plugins[i];
	  	}
	}
}

var getPlugins = function() {
	return plugins;
}

var root = {
	user: getUser,
	users: getUsers,
	plugin: getPlugin,
	plugins: getPlugins
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