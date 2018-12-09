var mongodb = require('mongodb');
var mongo = require('../../src/mongo-connect');
var {buildSchema} = require('graphql');

exports.schema = buildSchema(`
	type Query {
		consult(doctor_name: String!): Consult,
		consults: [Consult]
	},

	type Consult {
  		patient_name: String,
  		doctor_name: String,
  		fulldate: String,
  		diagnosis: String,
  		medicine: String
  	},

  	type Mutation {
		updateConsult(doctor_name: String!, input: ConsultInput): Consult,
		createConsult(input: ConsultInput): Consult,
		deleteConsult(doctor_name: String!): Consult
	},

	input ConsultInput {
  		patient_name: String,
  		doctor_name: String,
  		fulldate: String,
  		diagnosis: String,
  		medicine: String
  	}
`);

var consults = [];
mongo.mongoConsult("find", {}, function(response) {
	for(var i = 0; i < response.length; i++)
		consults.push(response[i]);
});

var getConsult = function(args) {
	var doctorName = args.doctor_name;
  	for(var i = 0; i < consults.length; i++) {
	  	if(doctorName == consults[i].doctor_name) {
	  		return consults[i];
	  	}
	}
}

var getConsults = function() {
	return consults;
}

var updateConsultFunction = function({doctor_name, input}) {
	var doctorName = doctor_name;
  	for(var i = 0; i < consults.length; i++) {
	  	if(doctorName == consults[i].doctor_name) {
	  		consults[i] = input;
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
	consults: getConsults,
	updateConsult: updateConsultFunction,
	createConsult: createConsultFunction,
	deleteConsult: deleteConsultFunction
};