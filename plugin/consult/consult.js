const mongodb = require('mongodb');
const mongo = require('../../src/mongo-connect');

exports.add = function(req, res) {
	let obj = {
		doctor_name: req.body.doctor_name,
		patient_name: req.body.patient_name,
		checkin_date: req.body.checkin_date,
		status: req.body.status
	}
	mongo.mongoConsult("insert", obj, function(response) {
		res.json(response);
	});
}

exports.update = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = [{_id: o_id}, {$set: {patient_name: req.body.patient_name, doctor_name: req.body.doctor_name, checkin_date: req.body.checkin_date, consult_date: req.body.consult_date, diagnosis: req.body.diagnosis, medicine: req.body.medicine, status: req.body.status}}];
	mongo.mongoConsult("update", query, function(response) {
		res.json(response);
	});
}