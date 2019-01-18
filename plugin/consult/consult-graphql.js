var mongodb = require('mongodb');
var mongo = require('../../src/mongo-connect');
var {buildSchema} = require('graphql');

exports.schema = buildSchema(`
	type Query {
		consult(_id: String!): Consult,
		consultPending(_id: String!): Consult,
		consultMed(_id: String!): Consult,
		consults: [Consult]
	},

	type Consult {
		_id: String,
  		patient_name: String,
  		doctor_name: String,
  		checkin_date: String,
  		consult_date: String,
  		diagnosis: String,
  		medicine: [String],
  		status : String
  	},

  	type Mutation {
		updateConsult(_id: String!, input: ConsultInput): Consult,
		createConsult(input: ConsultInput): Consult,
		deleteConsult(_id: String!): Consult
	},

	input ConsultInput {
		_id: String,
  		patient_name: String,
  		doctor_name: String,
  		checkin_date: String,
  		consult_date: String,
  		diagnosis: String,
  		medicine: [String],
  		status : String
  	}
`);

var consults = [];
mongo.mongoConsult("find", {}, function(response) {
	for(var i = 0; i < response.length; i++) {
		response[i]._id = response[i]._id.toString();
		consults.push(response[i]);
	}
});

var getConsult = function(args) {
	var consultId = args._id;
  	for(var i = 0; i < consults.length; i++) {
	  	if(consultId == consults[i]._id) {
	  		return consults[i];
	  	}
	}
}

var getConsults = function() {
	return consults;
}

var updateConsultFunction = function({_id, input}) {
	var consultId = _id;
  	for(var i = 0; i < consults.length; i++) {
	  	if(consultId == consults[i]._id && (consults[i].status == "pending" || consults[i].status == "ongoing"
	  		|| consults[i].status == "waitmed")) {
	  		let _id = consults[i]._id;
	  		let patient_name = consults[i].patient_name;
	  		let doctor_name = consults[i].doctor_name;
	  		let checkin_date = consults[i].checkin_date;
	  		let consult_date = consults[i].consult_date;
	  		let diagnosis = consults[i].diagnosis;
	  		let medicine = consults[i].medicine;
	  		let status = consults[i].status;
	  		consults[i] = input;
	  		if(consults[i]._id == undefined)
	  			consults[i]._id = _id;
	  		if(consults[i].patient_name == undefined)
	  			consults[i].patient_name = patient_name;
	  		if(consults[i].doctor_name == undefined)
	  			consults[i].doctor_name = doctor_name;
	  		if(consults[i].checkin_date == undefined)
	  			consults[i].checkin_date = checkin_date;
	  		if(consults[i].consult_date == undefined)
	  			consults[i].consult_date = consult_date;
	  		if(consults[i].diagnosis == undefined)
	  			consults[i].diagnosis = diagnosis;
	  		if(consults[i].medicine == undefined)
	  			consults[i].medicine = medicine;
	  		if(consults[i].status == undefined)
	  			consults[i].status = status;
	  		return input;
	  	}
	}
}

var createConsultFunction = function({input}) {
	consults.push(input);
	return input;
}

var deleteConsultFunction = function({_id}) {
	var consultId = _id;
  	for(var i = 0; i < consults.length; i++) {
	  	if(consultId == consults[i]._id) {
	  		consults.splice(i, 1);
	  		return consults[i]._id;
	  	}
	}
}

exports.root = {
	consult: getConsult,
	consults: getConsults,
	updateConsult: updateConsultFunction,
	createConsult: createConsultFunction,
	deleteConsult: deleteConsultFunction
};