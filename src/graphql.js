var mongodb = require('mongodb');
var mongo = require('./mongo-connect');
var {buildSchema} = require('graphql');
var mergeSchema = require('graphql-tools');
var blogGraphql = require('../plugin/blog/blog-graphql');

var defaultSchema = buildSchema(`
	type Query {
		user(fullname: String!): Person,
		users: [Person],
		plugin(name: String!): Plugin,
		plugins: [Plugin],
	},

	type Person {
	    fullname: String,
	    email: String,
	    role: String,
	    authority: Authority 
  	},

  	type Authority {
  		read: Int,
  		create: Int,
  		update: Int,
  		delete: Int
  	},

  	type Plugin {
  		name: String,
  		status: Int
  	}
`);

var schemas = [];
schemas.push(defaultSchema);
schemas.push(blogGraphql.schema);

exports.schema = mergeSchema.mergeSchemas({
  schemas: schemas
});

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

exports.root = {
	user: getUser,
	users: getUsers,
	plugin: getPlugin,
	plugins: getPlugins,
	blog: blogGraphql.root.blog,
	blogs: blogGraphql.root.blogs
};