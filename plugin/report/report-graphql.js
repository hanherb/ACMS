var mongodb = require('mongodb');
var mongo = require('../../src/mongo-connect');
var {buildSchema} = require('graphql');

exports.schema = buildSchema(`
	type Query {
		commerce(name: String!): Commerce,
		commerces: [Commerce],
	},

	type Commerce {
  		name: String,
  		price: Int,
  		qty: Int,
  		description: String,
  		user: String,
  		image: String
  	},

  	type Mutation {
		updateCommerce(name: String!, input: CommerceInput): Commerce,
		createCommerce(input: CommerceInput): Commerce,
		deleteCommerce(name: String!): Commerce
	},

	input CommerceInput {
  		name: String,
  		price: Int,
  		qty: Int,
  		description: String,
  		user: String,
  		image: String
  	}
`);

var commerces = [];
mongo.mongoCommerce("find", {}, function(response) {
	for(var i = 0; i < response.length; i++) {
		commerces.push(response[i]);
	}
});

var getCommerce = function(args) {
	var itemName = args.name;
  	for(var i = 0; i < commerces.length; i++) {
	  	if(itemName == commerces[i].name) {
	  		return commerces[i];
	  	}
	}
}

var getCommerces = function() {
	return commerces;
}

var updateCommerceFunction = function({name, input}) {
	var itemName = name;
  	for(var i = 0; i < commerces.length; i++) {
	  	if(itemName == commerces[i].name) {
	  		commerces[i] = input;
	  		return input;
	  	}
	}
}

var createCommerceFunction = function({input}) {
	commerces.push(input);
	return input;
}

var deleteCommerceFunction = function({name}) {
	var itemName = name;
  	for(var i = 0; i < commerces.length; i++) {
	  	if(itemName == commerces[i].name) {
	  		commerces.splice(i, 1);
	  		return commerces[i].name;
	  	}
	}
}

exports.root = {
	commerce: getCommerce,
	commerces: getCommerces,
	updateCommerce: updateCommerceFunction,
	createCommerce: createCommerceFunction,
	deleteCommerce: deleteCommerceFunction,
};