var mongodb = require('mongodb');
var mongo = require('../../src/mongo-connect');
var {buildSchema} = require('graphql');

exports.schema = buildSchema(`
	type Query {
		supply(supplier_name: String!): Supply,
		supplies: [Supply],
	},

	type Supply {
  		supplier_name: String,
  		medicine: String,
  		qty: Int,
  		supply_date: String
  	},

  	type Mutation {
		updateSupply(name: String!, input: SupplyInput): Supply,
		createSupply(input: SupplyInput): Supply,
		deleteSupply(name: String!): Supply
	},

	input SupplyInput {
  		supplier_name: String,
  		medicine: String,
  		qty: Int,
  		supply_date: String
  	}
`);

var supplies = [];
mongo.mongoSupply("find", {}, function(response) {
	for(var i = 0; i < response.length; i++)
		supplies.push(response[i]);
});

var getSupply = function(args) {
	var supplierName = args.supplier_name;
  	for(var i = 0; i < supplies.length; i++) {
	  	if(supplierName == supplies[i].supplier_name) {
	  		return supplies[i];
	  	}
	}
}

var getSupplies = function() {
	return supplies;
}

var updateSupplyFunction = function({supplier_name, input}) {
	var supplierName = supplier_name;
  	for(var i = 0; i < supplies.length; i++) {
	  	if(supplierName == supplies[i].supplier_name) {
	  		supplies[i] = input;
	  		return input;
	  	}
	}
}

var createSupplyFunction = function({input}) {
	supplies.push(input);
	return input;
}

var deleteSupplyFunction = function({supplier_name}) {
	var supplierName = supplier_name;
  	for(var i = 0; i < supplies.length; i++) {
	  	if(supplierName == supplies[i].supplier_name) {
	  		supplies.splice(i, 1);
	  		return supplies[i].supplier_name;
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