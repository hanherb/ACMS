const mongodb = require('mongodb');
const mongo = require('../../src/mongo-connect');

exports.add = function(req, res) {
	let obj = {
		supplier_name: req.body.supplier_name,
		medicine: req.body.medicine,
		qty: req.body.qty,
		supply_date: req.body.supply_date
	}
	mongo.mongoSupply("insert", obj, function(response) {
		res.json(response);
	});
}

exports.itemSupplied = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = [{_id: o_id}, {$set: {qty: req.body.qty}}];
	mongo.mongoCommerce("update", query, function(response) {
		res.json(response);
	});
}