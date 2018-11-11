var mongodb = require('mongodb');
var mongo = require('./mongo-connect');
var {buildSchema} = require('graphql');

exports.schema = buildSchema(`
	type Query {
		user(fullname: String!): Person,
		users: [Person],
		plugin(name: String!): Plugin,
		plugins: [Plugin],
		blog(title: String!): Blog,
		blogs: [Blog]
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

  	type Blog {
  		title: String,
  		content: String
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

var blogs = [];
mongo.mongoBlog("find", {}, function(response) {
	for(var i = 0; i < response.length; i++)
		blogs.push(response[i]);
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

var getBlog = function(args) { // return a single user based on id
	var blogTitle = args.title;
  	for(var i = 0; i < blogs.length; i++) {
	  	if(blogTitle == blogs[i].title) {
	  		return blogs[i];
	  	}
	}
}

var getBlogs = function() {
	return blogs;
}

exports.root = {
	user: getUser,
	users: getUsers,
	plugin: getPlugin,
	plugins: getPlugins,
	blog: getBlog,
	blogs: getBlogs
};