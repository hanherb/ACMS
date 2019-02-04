const mongodb = require('mongodb');
const mongo = require('../../src/mongo-connect');

exports.add = function(req, res) {
	let obj = {
		name: req.body.name,
		price: req.body.price,
		qty: req.body.qty,
		description: req.body.description,
		user: req.body.user,
		image: req.body.image
	}
	mongo.mongoCommerce("insert", obj, function(response) {
		res.json(response);
	});
}

exports.update = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = [{_id: o_id}, {$set: {name: req.body.name, price: req.body.price, qty: req.body.qty, description: req.body.description, image: req.body.image}}];
	mongo.mongoCommerce("update", query, function(response) {
		console.log(response.result.nModified);
		res.json(response);
	});
}

exports.delete = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = {_id: o_id};
	mongo.mongoCommerce("delete", query, function(response) {
		res.json(response);
	});
}

exports.substractQty = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = [{_id: o_id}, {$set: {qty: req.body.qty}}];
	mongo.mongoCommerce("update", query, function(response) {
		res.json(response);
	});
}

exports.addTransaction = function(req, res) {
	for(let i = 0; i < req.body.length; i++) {
		delete req.body[i].prevQty;
	}
	mongo.mongoTransaction("insert", req.body, function(response) {
		res.json(response);
	});
}