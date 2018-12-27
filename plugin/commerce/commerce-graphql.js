var mongodb = require('mongodb');
var mongo = require('../../src/mongo-connect');
var {buildSchema} = require('graphql');

exports.schema = buildSchema(`
	type Query {
		commerce(name: String!): Commerce,
		commerces: [Commerce],
		transaction(patient_name: String!): Transaction,
		transactions: [Transaction]
	},

	type Commerce {
  		name: String,
  		price: Int,
  		qty: Int,
  		description: String,
  		user: String,
  		image: String
  	},

  	type Transaction {
  		patient_name: String,
  		medicine: String,
  		transaction_date: String,
  		price: Int
  	},

  	type Mutation {
		updateCommerce(name: String!, input: CommerceInput): Commerce,
		createCommerce(input: CommerceInput): Commerce,
		deleteCommerce(name: String!): Commerce,
		updateTransaction(patient_name: String!, input: TransactionInput): Transaction,
		createTransaction(input: TransactionInput): Transaction,
		deleteTransaction(patient_name: String!): Transaction
	},

	input CommerceInput {
  		name: String,
  		price: Int,
  		qty: Int,
  		description: String,
  		user: String,
  		image: String
  	},

  	input TransactionInput {
  		patient_name: String,
  		medicine: String,
  		transaction_date: String,
  		price: Int
  	},
`);

var commerces = [];
mongo.mongoCommerce("find", {}, function(response) {
	for(var i = 0; i < response.length; i++)
		commerces.push(response[i]);
});

var transactions = [];
mongo.mongoTransaction("find", {}, function(response) {
	for(var i = 0; i < response.length; i++)
		transactions.push(response[i]);
});

var getCommerce = function(args) {
	var itemName = args.name;
  	for(var i = 0; i < commerces.length; i++) {
	  	if(itemName == commerces[i].name) {
	  		return commerces[i];
	  	}
	}
}

var getTransaction = function(args) {
	var patientName = args.patient_name;
  	for(var i = 0; i < transactions.length; i++) {
	  	if(patientName == transactions[i].patient_name) {
	  		return transactions[i];
	  	}
	}
}

var getCommerces = function() {
	return commerces;
}

var getTransactions = function() {
	return transactions;
}

var updateCommerceFunction = function({name, input}) {
	var itemName = name;
  	for(var i = 0; i < commerces.length; i++) {
	  	if(itemName == commerces[i].name) {
	  		let name = commerces[i].name;
	  		let price = commerces[i].price;
	  		let qty = commerces[i].qty;
	  		let description = commerces[i].description;
	  		let user = commerces[i].user;
	  		let image = commerces[i].image;
	  		commerces[i] = input;
	  		if(commerces[i].name == undefined)
	  			commerces[i].name = name;
	  		if(commerces[i].price == undefined)
	  			commerces[i].price = price;
	  		if(commerces[i].qty == undefined)
	  			commerces[i].qty = qty;
	  		if(commerces[i].description == undefined)
	  			commerces[i].description = description;
	  		if(commerces[i].user == undefined)
	  			commerces[i].user = user;
	  		if(commerces[i].image == undefined)
	  			commerces[i].image = image;
	  		return input;
	  	}
	}
}

var updateTransactionFunction = function({patient_name, input}) {
	var patientName = patient_name;
  	for(var i = 0; i < transactions.length; i++) {
	  	if(patientName == transactions[i].patient_name) {
	  		transactions[i] = input;
	  		return input;
	  	}
	}
}

var createCommerceFunction = function({input}) {
	commerces.push(input);
	return input;
}

var createTransactionFunction = function({input}) {
	transactions.push(input);
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

var deleteTransactionFunction = function({patient_name}) {
	var patient_name = patient_name;
  	for(var i = 0; i < transactions.length; i++) {
	  	if(patient_name == transactions[i].patient_name) {
	  		transactions.splice(i, 1);
	  		return transactions[i].patient_name;
	  	}
	}
}

exports.root = {
	commerce: getCommerce,
	commerces: getCommerces,
	transaction: getTransaction,
	transactions: getTransactions,
	updateCommerce: updateCommerceFunction,
	createCommerce: createCommerceFunction,
	deleteCommerce: deleteCommerceFunction,
	updateTransaction: updateTransactionFunction,
	createTransaction: createTransactionFunction,
	deleteTransaction: deleteTransactionFunction
};