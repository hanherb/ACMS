var mongodb = require('mongodb');
var mongo = require('../../src/mongo-connect');
var {buildSchema} = require('graphql');

exports.schema = buildSchema(`
	type Query {
		commerce(_id: String!): Commerce,
		commerces: [Commerce],
		transaction(_id: String!): Transaction,
		transactions: [Transaction]
	},

	type Commerce {
		_id: String,
  		name: String,
  		price: Int,
  		qty: Int,
  		description: String,
  		user: String,
  		image: String
  	},

  	type Transaction {
  		_id: String,
  		buyer_name: String,
  		medicine: String,
  		transaction_date: String,
  		price: Int
  	},

  	type Mutation {
		updateCommerce(_id: String!, input: CommerceInput): Commerce,
		createCommerce(input: CommerceInput): Commerce,
		deleteCommerce(_id: String!): Commerce,
		updateTransaction(_id: String!, input: TransactionInput): Transaction,
		createTransaction(input: TransactionInput): Transaction,
		deleteTransaction(_id: String!): Transaction
	},

	input CommerceInput {
		_id: String,
  		name: String,
  		price: Int,
  		qty: Int,
  		description: String,
  		user: String,
  		image: String
  	},

  	input TransactionInput {
  		_id: String,
  		buyer_name: String,
  		medicine: String,
  		transaction_date: String,
  		price: Int
  	},
`);

var commerces = [];
mongo.mongoCommerce("find", {}, function(response) {
	for(var i = 0; i < response.length; i++) {
		response[i]._id = response[i]._id.toString();
		commerces.push(response[i]);
	}
});

var transactions = [];
mongo.mongoTransaction("find", {}, function(response) {
	for(var i = 0; i < response.length; i++) {
		response[i]._id = response[i]._id.toString();
		transactions.push(response[i]);
	}
});

var getCommerce = function(args) {
	var itemId = args._id;
  	for(var i = 0; i < commerces.length; i++) {
	  	if(itemId == commerces[i]._id) {
	  		return commerces[i];
	  	}
	}
}

var getTransaction = function(args) {
	var transactionId = args._id;
  	for(var i = 0; i < transactions.length; i++) {
	  	if(transactionId == transactions[i]._id) {
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

var updateCommerceFunction = function({_id, input}) {
	var itemId = _id;
  	for(var i = 0; i < commerces.length; i++) {
	  	if(itemId == commerces[i]._id) {
	  		let id = commerces[i]._id;
	  		let name = commerces[i].name;
	  		let price = commerces[i].price;
	  		let qty = commerces[i].qty;
	  		let description = commerces[i].description;
	  		let user = commerces[i].user;
	  		let image = commerces[i].image;
	  		commerces[i] = input;
	  		if(commerces[i]._id == undefined)
	  			commerces[i]._id = id;
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

var updateTransactionFunction = function({_id, input}) {
	var transactionId = _id;
  	for(var i = 0; i < transactions.length; i++) {
	  	if(transactionId == transactions[i]._id) {
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

var deleteCommerceFunction = function({_id}) {
	var itemId = _id;
  	for(var i = 0; i < commerces.length; i++) {
	  	if(itemId == commerces[i]._id) {
	  		commerces.splice(i, 1);
	  		return commerces[i]._id;
	  	}
	}
}

var deleteTransactionFunction = function({_id}) {
	var transactionId = _id;
  	for(var i = 0; i < transactions.length; i++) {
	  	if(transactionId == transactions[i]._id) {
	  		transactions.splice(i, 1);
	  		return transactions[i]._id;
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