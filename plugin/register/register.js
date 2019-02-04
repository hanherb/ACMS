const mongodb = require('mongodb');
const mongo = require('../../src/mongo-connect');

exports.register = function(req, res) {
	let obj = {
		email: req.body.email,
		fullname: req.body.fullname,
		password: req.body.password,
		role: req.body.role,
		authority: req.body.authority
	};
	mongo.mongoUser("insert", obj, function(response) {
		res.json(response);
	});
}