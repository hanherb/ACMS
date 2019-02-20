const mongodb = require('mongodb');
const mongo = require('../../src/mongo-connect');

exports.add = function(req, res) {
	let obj = {
  		account_name: req.body.account_name,
  		total: req.body.total,
  		update_date: req.body.update_date
	}
	mongo.mongoAccount("insert", obj, function(response) {
		res.json(response);
	});
}

exports.update = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = [{_id: o_id}, {$set: {account_name: req.body.account_name, total: req.body.total, update_date: req.body.update_date}}];
	mongo.mongoAccount("update", query, function(response) {
		res.json(response);
	});
}

exports.delete = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = {_id: o_id};
	mongo.mongoAccount("delete", query, function(response) {
		res.json(response);
	});
}

exports.addLedger = function(req, res) {
	let obj = {
  		account_name: req.body.account_name,
  		detail: req.body.detail,
  		date: req.body.date,
  		debit: req.body.debit,
  		credit: req.body.credit,
  		balance: req.body.balance
	}
	mongo.mongoLedger("insert", obj, function(response) {
		res.json(response);
	});
}