var mongodb = require('mongodb');
var mongo = require('./mongo-connect');
var {buildSchema} = require('graphql');
var mergeSchema = require('graphql-tools');
var blogGraphql = require('../plugin/blog/blog-graphql');
var commerceGraphql = require('../plugin/commerce/commerce-graphql');
var consultGraphql = require('../plugin/consult/consult-graphql');
var supplyGraphql = require('../plugin/supply/supply-graphql');

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
  		blog: Int,
  		commerce: Int,
  		consult: Int,
  		supply: Int,
  		report: Int
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
		createPlugin(input: PluginInput): Plugin
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
  		blog: Int,
  		commerce: Int,
  		consult: Int,
  		supply: Int,
  		report: Int
  	},

  	input PluginInput {
  		name: String,
  		status: Int
  	}
`);

var schemas = [];
schemas.push(defaultSchema);
schemas.push(blogGraphql.schema);
schemas.push(commerceGraphql.schema);
schemas.push(consultGraphql.schema);
schemas.push(supplyGraphql.schema);

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

var updateUserFunction = function({email, input}) {
	var userEmail = email;
  	for(var i = 0; i < users.length; i++) {
	  	if(userEmail == users[i].email) {
	  		let email = users[i].email;
	  		let fullname = users[i].fullname;
	  		let role = users[i].role;
	  		let authority = users[i].authority;
	  		users[i] = input;
	  		if(users[i].email == undefined)
	  			users[i].email = email;
	  		if(users[i].fullname == undefined)
	  			users[i].fullname = fullname;
	  		if(users[i].role == undefined)
	  			users[i].role = role;
	  		if(users[i].authority == undefined)
	  			users[i].authority = authority;
	  		return input;
	  	}
	}
}

var createUserFunction = function({input}) {
	users.push(input);
	return input;
}

var deleteUserFunction = function({email}) {
	var userEmail = email;
  	for(var i = 0; i < users.length; i++) {
	  	if(userEmail == users[i].email) {
	  		users.splice(i, 1);
	  		return users[i].email;
	  	}
	}
}

var createPluginFunction = function({input}) {
	plugins.push(input);
	return input;
}

var updatePluginFunction = function({name, input}) {
	var pluginName = name;
	for(var i = 0; i < plugins.length; i++) {
		if(pluginName == plugins[i].name) {
			plugins[i] = input;
			return input;
		}
	}
}


exports.root = {
	user: getUser,
	users: getUsers,
	plugin: getPlugin,
	plugins: getPlugins,
	blog: blogGraphql.root.blog,
	blogs: blogGraphql.root.blogs,
	commerce: commerceGraphql.root.commerce,
	commerces: commerceGraphql.root.commerces,
	transaction: commerceGraphql.root.transaction,
	transactions: commerceGraphql.root.transactions,
	consult: consultGraphql.root.consult,
	consultPending: consultGraphql.root.consultPending,
	consultMed: consultGraphql.root.consultMed,
	consults: consultGraphql.root.consults,
	supply: supplyGraphql.root.supply,
	supplies: supplyGraphql.root.supplies,
	updateUser: updateUserFunction,
	createUser: createUserFunction,
	deleteUser: deleteUserFunction,
	createPlugin: createPluginFunction,
	updatePlugin: updatePluginFunction,
	updateBlog: blogGraphql.root.updateBlog,
	createBlog: blogGraphql.root.createBlog,
	deleteBlog: blogGraphql.root.deleteBlog,
	updateCommerce: commerceGraphql.root.updateCommerce,
	createCommerce: commerceGraphql.root.createCommerce,
	deleteCommerce: commerceGraphql.root.deleteCommerce,
	updateTransaction: commerceGraphql.root.updateTransaction,
	createTransaction: commerceGraphql.root.createTransaction,
	deleteTransaction: commerceGraphql.root.deleteTransaction,
	updateConsult: consultGraphql.root.updateConsult,
	createConsult: consultGraphql.root.createConsult,
	deleteConsult: consultGraphql.root.deleteConsult,
	updateSupply: supplyGraphql.root.updateSupply,
	createSupply: supplyGraphql.root.createSupply,
	deleteSupply: supplyGraphql.root.deleteSupply
};