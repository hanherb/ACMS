var mongodb = require('mongodb');
var mongo = require('./mongo-connect');
var {buildSchema} = require('graphql');
var mergeSchema = require('graphql-tools');
var blogGraphql = require('../plugin/blog/blog-graphql');

var defaultSchema = buildSchema(`
	type Query {
		user(email: String!): Person,
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
  		user: AuthorityUser,
  		api: AuthorityApi
  	},

  	type AuthorityUser {
  		read: Int,
  		create: Int,
  		update: Int,
  		delete: Int
  	},

  	type AuthorityApi {
  		user: Int,
  		plugin: Int
  	},

  	type Plugin {
  		name: String,
  		status: Int
  	},

  	type Mutation {
		updateUser(email: String!, input: PersonInput): Person,
		createUser(input: PersonInput): Person,
		deleteUser(email: String!): Person,
		updatePlugin(name: String!, input: PluginInput): Plugin
	},

	input PersonInput {
	    fullname: String,
	    email: String,
	    role: String,
	    authority: AuthorityInput,
	    password: String
  	},

  	input AuthorityInput {
  		user: AuthorityUserInput,
  		api: AuthorityApiInput
  	},

  	input AuthorityUserInput {
  		read: Int,
  		create: Int,
  		update: Int,
  		delete: Int
  	},

  	input AuthorityApiInput {
  		user: Int,
  		plugin: Int
  	},

  	input PluginInput {
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

var getUser = function(args) {
	var userEmail = args.email;
  	for(var i = 0; i < users.length; i++) {
	  	if(userEmail == users[i].email) {
	  		return users[i];
	  	}
	}
}

var getUsers = function() {
	return users;
}

var getPlugin = function(args) {
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
	blogs: blogGraphql.root.blogs,
	updateUser: function({email, input}) {
		var userEmail = email;
	  	for(var i = 0; i < users.length; i++) {
		  	if(userEmail == users[i].email) {
		  		users[i] = input;
		  		return input;
		  	}
		}
	},
	createUser: function({input}) {
		users.push(input);
		return input;
	},
	deleteUser: function({email}) {
		var userEmail = email;
	  	for(var i = 0; i < users.length; i++) {
		  	if(userEmail == users[i].email) {
		  		users.splice(i, 1);
		  		return users[i].email;
		  	}
		}
	},
	updatePlugin: function({name, input}) {
		var pluginName = name;
		for(var i = 0; i < plugins.length; i++) {
			if(pluginName == plugins[i].name) {
				plugins[i] = input;
				return input;
			}
		}
	},
	updateBlog: blogGraphql.root.updateBlog,
	createBlog: blogGraphql.root.createBlog,
	deleteBlog: blogGraphql.root.deleteBlog
};