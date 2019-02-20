var mongodb = require('mongodb');
var mongo = require('../../src/mongo-connect');
var {buildSchema} = require('graphql');

exports.schema = buildSchema(`
	type Query {
		account(_id: String!): Account,
		accounts: [Account],
		ledger(_id: String!): Ledger,
		ledgers: [Ledger]
	},

	type Account {
		_id: String,
  		account_name: String,
  		total: Int,
  		update_date: String
  	},

  	type Ledger {
		_id: String,
		account_name: String,
  		detail: String,
  		date: String,
  		debit: Int,
  		credit: Int,
  		balance: Int
  	},

  	type Mutation {
		updateAccount(_id: String!, input: AccountInput): Account,
		createAccount(input: AccountInput): Account,
		deleteAccount(_id: String!): Account
		updateLedger(_id: String!, input: LedgerInput): Ledger,
		createLedger(input: LedgerInput): Ledger,
		deleteLedger(_id: String!): Ledger
	},

	input AccountInput {
		_id: String,
  		account_name: String,
  		total: Int,
  		update_date: String
  	}

  	input LedgerInput {
		_id: String,
		account_name: String,
  		detail: String,
  		date: String,
  		debit: Int,
  		credit: Int,
  		balance: Int
  	},
`);

var accounts = [];
mongo.mongoAccount("find", {}, function(response) {
	for(var i = 0; i < response.length; i++) {
		response[i]._id = response[i]._id.toString();
		accounts.push(response[i]);
	}
});

var ledgers = [];
mongo.mongoLedger("find", {}, function(response) {
	for(var i = 0; i < response.length; i++) {
		response[i]._id = response[i]._id.toString();
		ledgers.push(response[i]);
	}
});

var getAccount = function(args) {
	var accountId = args._id;
  	for(var i = 0; i < accounts.length; i++) {
	  	if(accountId == accounts[i]._id) {
	  		return accounts[i];
	  	}
	}
}

var getAccounts = function() {
	return accounts;
}

var getLedger = function(args) {
	var ledgerId = args._id;
  	for(var i = 0; i < ledgers.length; i++) {
	  	if(ledgerId == ledgers[i]._id) {
	  		return ledgers[i];
	  	}
	}
}

var getLedgers = function() {
	return ledgers;
}

var updateAccountFunction = function({_id, input}) {
	var accountId = _id;
  	for(var i = 0; i < accounts.length; i++) {
	  	if(accountId == accounts[i]._id) {
	  		accounts[i] = input;
	  		return input;
	  	}
	}
}

var createAccountFunction = function({input}) {
	accounts.push(input);
	return input;
}

var deleteAccountFunction = function({_id}) {
	var accountId = _id;
  	for(var i = 0; i < accounts.length; i++) {
	  	if(accountId == accounts[i]._id) {
	  		accounts.splice(i, 1);
	  		return accounts[i]._id;
	  	}
	}
}

var updateLedgerFunction = function({_id, input}) {
	var ledgerId = _id;
  	for(var i = 0; i < ledgers.length; i++) {
	  	if(ledgerId == ledgers[i]._id) {
	  		ledgers[i] = input;
	  		return input;
	  	}
	}
}

var createLedgerFunction = function({input}) {
	ledgers.push(input);
	return input;
}

var deleteLedgerFunction = function({_id}) {
	var ledgerId = _id;
  	for(var i = 0; i < ledgers.length; i++) {
	  	if(ledgerId == ledgers[i]._id) {
	  		ledgers.splice(i, 1);
	  		return ledgers[i]._id;
	  	}
	}
}

exports.root = {
	account: getAccount,
	accounts: getAccounts,
	ledger: getLedger,
	ledgers: getLedgers,
	updateAccount: updateAccountFunction,
	createAccount: createAccountFunction,
	deleteAccount: deleteAccountFunction,
	updateLedger: updateLedgerFunction,
	createLedger: createLedgerFunction,
	deleteLedger: deleteLedgerFunction
};