const mongodb = require('mongodb');
const mongo = require('../../src/mongo-connect');

exports.add = function(req, res) {
	let obj = {
		title: req.body.title,
		content: req.body.content,
		date: req.body.date,
		month: req.body.month,
		year: req.body.year,
		author: req.body.author
	}
	mongo.mongoBlog("insert", obj, function(response) {
		res.json(response);
	});
}

exports.update = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = [{_id: o_id}, {$set: {title: req.body.title, content: req.body.content, date: req.body.date, month: req.body.month, year: req.body.year}}];
	mongo.mongoBlog("update", query, function(response) {
		res.json(response);
	});
}

exports.delete = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = {_id: o_id};
	mongo.mongoBlog("delete", query, function(response) {
		res.json(response);
	});
}