var mongodb = require('mongodb');
var mongo = require('./mongo-connect');
var {buildSchema} = require('graphql');
var mergeSchema = require('graphql-tools');
var blogGraphql = require('../plugin/blog/blog-graphql');
var commerceGraphql = require('../plugin/commerce/commerce-graphql');
var consultGraphql = require('../plugin/consult/consult-graphql');
var supplyGraphql = require('../plugin/supply/supply-graphql');
var accountGraphql = require('../plugin/account/account-graphql');

var defaultSchema = buildSchema(`
	type Query {
		user(_id: String!): Person,
		users: [Person],
		logs: [Log],
		roles: [Role],
		plugin(name: String!): Plugin,
		plugins: [Plugin],
	},

	type Person {
		_id: String,
	    fullname: String,
	    email: String,
	    role: String,
	    authority: [String]
  	},

  	type Log {
  		_id: String,
  		path: String,
  		userId: String,
  		date: String
  	},

  	type Plugin {
  		name: String,
  		status: Int
  	},

  	type Role {
		role_name: String
  	},

  	type Mutation {
		updateUser(email: String!, input: PersonInput): Person,
		createUser(input: PersonInput): Person,
		deleteUser(email: String!): Person,
		createLog(input: LogInput): Log,
		updatePlugin(name: String!, input: PluginInput): Plugin
		createPlugin(input: PluginInput): Plugin
	},

	input PersonInput {
		_id: String,
	    fullname: String,
	    email: String,
	    role: String,
	    authority: [String],
	    password: String
  	},

  	input LogInput {
  		_id: String,
  		path: String,
  		userId: String,
  		date: String
  	}

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
schemas.push(accountGraphql.schema);

exports.schema = mergeSchema.mergeSchemas({
  schemas: schemas
});

var users = [];
mongo.mongoUser("find", {}, function(response) {
	for(var i = 0; i < response.length; i++) {
		response[i]._id = response[i]._id.toString();
		users.push(response[i]);
	}
});

var logs = [];
mongo.mongoLogger("find", {}, function(response) {
	for(var i = 0; i < response.length; i++) {
		response[i]._id = response[i]._id.toString();
		logs.push(response[i]);
	}
});

var roles = [];
mongo.mongoRole("find", {}, function(response) { 
	for(var i = 0; i < response.length; i++) {
		roles.push(response[i]);
	}
});

var plugins = [];
mongo.mongoPlugin("find", {}, function(response) {
	for(var i = 0; i < response.length; i++) {
		plugins.push(response[i]);
	}
});

var getUser = function(args) {
	var userId = args._id;
  	for(var i = 0; i < users.length; i++) {
	  	if(userId == users[i]._id) {
	  		return users[i];
	  	}
	}
}

var getUsers = function() {
	return users;
}

var getLogs = function() {
	return logs;
}

var getRoles = function() {
	return roles;
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
	  		let id = users[i]._id;
	  		let email = users[i].email;
	  		let fullname = users[i].fullname;
	  		let role = users[i].role;
	  		let authority = users[i].authority;
	  		users[i] = input;
	  		if(users[i]._id == undefined)
	  			users[i]._id = id;
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

var createLogFunction = function({input}) {
	logs.push(input);
	return input;
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
	logs: getLogs,
	roles: getRoles,
	plugin: getPlugin,
	plugins: getPlugins,

	blog: blogGraphql.root.blog,
	blogs: blogGraphql.root.blogs,

	commerce: commerceGraphql.root.commerce,
	commerces: commerceGraphql.root.commerces,
	transaction: commerceGraphql.root.transaction,
	transactions: commerceGraphql.root.transactions,

	consult: consultGraphql.root.consult,
	consults: consultGraphql.root.consults,

	supply: supplyGraphql.root.supply,
	supplies: supplyGraphql.root.supplies,

	account: accountGraphql.root.account,
	accounts: accountGraphql.root.accounts,
	ledger: accountGraphql.root.ledger,
	ledgers: accountGraphql.root.ledgers,

	updateUser: updateUserFunction,
	createUser: createUserFunction,
	deleteUser: deleteUserFunction,
	createLog: createLogFunction,
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
	deleteSupply: supplyGraphql.root.deleteSupply,

	updateAccount: accountGraphql.root.updateAccount,
	createAccount: accountGraphql.root.createAccount,
	deleteAccount: accountGraphql.root.deleteAccount,
	updateLedger: accountGraphql.root.updateLedger,
	createLedger: accountGraphql.root.createLedger,
	deleteLedger: accountGraphql.root.deleteLedger
};