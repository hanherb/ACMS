var mongodb = require('mongodb');
var mongo = require('../../src/mongo-connect');
var {buildSchema} = require('graphql');

exports.schema = buildSchema(`
	type Query {
		supply(supplier_name: String!): Supply,
		supplies: [Supply],
	},

	type Supply {
		_id: String,
  		supplier_name: String,
  		medicine: String,
  		qty: Int,
  		supply_date: String
  	},

  	type Mutation {
		updateSupply(_id: String!, input: SupplyInput): Supply,
		createSupply(input: SupplyInput): Supply,
		deleteSupply(_id: String!): Supply
	},

	input SupplyInput {
		_id: String,
  		supplier_name: String,
  		medicine: String,
  		qty: Int,
  		supply_date: String
  	}
`);

var supplies = [];
mongo.mongoSupply("find", {}, function(response) {
	for(var i = 0; i < response.length; i++) {
		response[i]._id = response[i]._id.toString();
		supplies.push(response[i]);
	}
});

var getSupply = function(args) {
	var supplyId = args._id;
  	for(var i = 0; i < supplies.length; i++) {
	  	if(supplyId == supplies[i]._id) {
	  		return supplies[i];
	  	}
	}
}

var getSupplies = function() {
	return supplies;
}

var updateSupplyFunction = function({_id, input}) {
	var supplyId = _id;
  	for(var i = 0; i < supplies.length; i++) {
	  	if(supplyId == supplies[i]._id) {
	  		supplies[i] = input;
	  		return input;
	  	}
	}
}

var createSupplyFunction = function({input}) {
	supplies.push(input);
	return input;
}

var deleteSupplyFunction = function({_id}) {
	var supplyId = _id;
  	for(var i = 0; i < supplies.length; i++) {
	  	if(supplyId == supplies[i]._id) {
	  		supplies.splice(i, 1);
	  		return supplies[i]._id;
	  	}
	}
}

exports.root = {
	supply: getSupply,
	supplies: getSupplies,
	updateSupply: updateSupplyFunction,
	createSupply: createSupplyFunction,
	deleteSupply: deleteSupplyFunction,
};