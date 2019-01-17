var mongodb = require('mongodb');
var mongo = require('../../src/mongo-connect');
var {buildSchema} = require('graphql');

exports.schema = buildSchema(`
	type Query {
		consult(patient_name: String!): Consult,
		consultPending(patient_name: String!): Consult,
		consultMed(patient_name: String!): Consult,
		consults: [Consult]
	},

	type Consult {
  		patient_name: String,
  		doctor_name: String,
  		checkin_date: String,
  		consult_date: String,
  		diagnosis: String,
  		medicine: [String],
  		status : String
  	},

  	type Mutation {
		updateConsult(patient_name: String!, input: ConsultInput): Consult,
		createConsult(input: ConsultInput): Consult,
		deleteConsult(doctor_name: String!): Consult
	},

	input ConsultInput {
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
		consults.push(response[i]);
	}
});

var getConsult = function(args) {
	var patientName = args.patient_name;
  	for(var i = 0; i < consults.length; i++) {
	  	if(patientName == consults[i].patient_name) {
	  		return consults[i];
	  	}
	}
}

var getConsultPending = function(args) {
	var patientName = args.patient_name;
  	for(var i = 0; i < consults.length; i++) {
	  	if(patientName == consults[i].patient_name && (consults[i].status == "pending" || consults[i].status == "ongoing")) {
	  		return consults[i];
	  	}
	}
}

var getConsultMed = function(args) {
	var patientName = args.patient_name;
  	for(var i = 0; i < consults.length; i++) {
	  	if(patientName == consults[i].patient_name && consults[i].status == "waitmed") {
	  		return consults[i];
	  	}
	}
}

var getConsults = function() {
	return consults;
}

var updateConsultFunction = function({patient_name, input}) {
	var patientName = patient_name;
  	for(var i = 0; i < consults.length; i++) {
	  	if(patientName == consults[i].patient_name && (consults[i].status == "pending" || consults[i].status == "ongoing"
	  		|| consults[i].status == "waitmed")) {
	  		let patient_name = consults[i].patient_name;
	  		let doctor_name = consults[i].doctor_name;
	  		let checkin_date = consults[i].checkin_date;
	  		let consult_date = consults[i].consult_date;
	  		let diagnosis = consults[i].diagnosis;
	  		let medicine = consults[i].medicine;
	  		let status = consults[i].status;
	  		consults[i] = input;
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

var deleteConsultFunction = function({doctor_name}) {
	var doctorName = doctor_name;
  	for(var i = 0; i < consults.length; i++) {
	  	if(doctorName == consults[i].doctor_name) {
	  		consults.splice(i, 1);
	  		return consults[i].doctor_name;
	  	}
	}
}

exports.root = {
	consult: getConsult,
	consultPending: getConsultPending,
	consultMed: getConsultMed,
	consults: getConsults,
	updateConsult: updateConsultFunction,
	createConsult: createConsultFunction,
	deleteConsult: deleteConsultFunction
};