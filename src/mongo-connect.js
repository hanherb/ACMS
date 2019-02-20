var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
// var mongourl = 'mongodb://localhost:27017/';
var TortoiseDB = require('tortoisedb');

const torApp = new TortoiseDB({
	name: 'acms',
	port: 4000,
	mongoURI: 'mongodb://localhost:27017',
	batchLimit: 1000
});
torApp.start();

exports.mongoUser = function(action, query, callback) {
	MongoClient.connect(torApp.mongoShell._url, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			var dbo = db.db("acms");

			if(action == "find") {
				console.log("Connection Established. Action="+action);
				dbo.collection("user").find({}).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "insert") {
				console.log("Connection Established. Action="+action);
				dbo.collection("user").insert(query, function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "update") {
				console.log("Connection Established. Action="+action);
				dbo.collection("user").update(query[0], query[1], function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}

			else if(action == "delete") {
				console.log("Connection Established. Action="+action);
				dbo.collection("user").deleteOne(query, function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});			
		  	}

			else if(action == "find-query") {
				console.log("Connection Established. Action="+action);
				dbo.collection("user").find(query).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}
			else if(action == "session") {
				console.log("Connection Established. Action="+action);
				dbo.collection("user").find(query).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}
		}
	});
}

exports.mongoRole = function(action, query, callback) {
	MongoClient.connect(torApp.mongoShell._url, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			var dbo = db.db("acms");

			if(action == "find") {
				console.log("Connection Established. Action="+action);
				dbo.collection("role").find({}).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}
		}
	});
}

exports.mongoPlugin = function(action, query, callback) {
	MongoClient.connect(torApp.mongoShell._url, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			var dbo = db.db("acms");

			if(action == "update") {
				console.log("Connection Established. Action="+action);
				dbo.collection("plugin").update(query[0], query[1], query[2], function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}

			else if(action == "find") {
				dbo.collection("plugin").find({}).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}
		}
	});
}

exports.mongoBlog = function(action, query, callback) {
	MongoClient.connect(torApp.mongoShell._url, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			var dbo = db.db("acms");

			if(action == "insert") {
				console.log("Connection Established. Action="+action);
				dbo.collection("blog").insert(query, function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "find") {
				dbo.collection("blog").find({}).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "update") {
				dbo.collection("blog").update(query[0], query[1], function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}

			else if(action == "delete") {
				dbo.collection("blog").deleteOne(query, function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}
		}
	});
}

exports.mongoCommerce = function(action, query, callback) {
	MongoClient.connect(torApp.mongoShell._url, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			var dbo = db.db("acms");

			if(action == "insert") {
				console.log("Connection Established. Action="+action);
				dbo.collection("commerce").insert(query, function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "find") {
				dbo.collection("commerce").find({}).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "update") {
				dbo.collection("commerce").update(query[0], query[1], function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}

			else if(action == "delete") {
				dbo.collection("commerce").deleteOne(query, function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}
		}
	});
}

exports.mongoTransaction = function(action, query, callback) {
	MongoClient.connect(torApp.mongoShell._url, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			var dbo = db.db("acms");

			if(action == "insert") {
				console.log("Connection Established. Action="+action);
				dbo.collection("transaction").insert(query, function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "find") {
				dbo.collection("transaction").find({}).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "update") {
				dbo.collection("transaction").update(query[0], query[1], function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}

			else if(action == "delete") {
				dbo.collection("transaction").deleteOne(query, function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}
		}
	});
}

exports.mongoConsult = function(action, query, callback) {
	MongoClient.connect(torApp.mongoShell._url, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			var dbo = db.db("acms");

			if(action == "insert") {
				console.log("Connection Established. Action="+action);
				dbo.collection("consult").insert(query, function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "find") {
				dbo.collection("consult").find({}).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "update") {
				dbo.collection("consult").update(query[0], query[1], function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}

			else if(action == "delete") {
				dbo.collection("consult").deleteOne(query, function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}
		}
	});
}

exports.mongoSupply = function(action, query, callback) {
	MongoClient.connect(torApp.mongoShell._url, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			var dbo = db.db("acms");

			if(action == "insert") {
				console.log("Connection Established. Action="+action);
				dbo.collection("supply").insert(query, function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "find") {
				dbo.collection("supply").find({}).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "update") {
				dbo.collection("supply").update(query[0], query[1], function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}

			else if(action == "delete") {
				dbo.collection("supply").deleteOne(query, function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}
		}
	});
}

exports.mongoLogger = function(action, query, callback) {
	MongoClient.connect(torApp.mongoShell._url, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			var dbo = db.db("acms");

			if(action == "insert") {
				console.log("Connection Established. Action="+action);
				dbo.collection("logger").insertOne(query, function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "find") {
				dbo.collection("logger").find({}).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "update") {
				dbo.collection("logger").update(query[0], query[1], function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}

			else if(action == "delete") {
				dbo.collection("logger").deleteOne(query, function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}
		}
	});
}

exports.mongoAccount = function(action, query, callback) {
	MongoClient.connect(torApp.mongoShell._url, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			var dbo = db.db("acms");

			if(action == "insert") {
				console.log("Connection Established. Action="+action);
				dbo.collection("account").insert(query, function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "find") {
				dbo.collection("account").find({}).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "update") {
				dbo.collection("account").update(query[0], query[1], function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}

			else if(action == "delete") {
				dbo.collection("account").deleteOne(query, function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}
		}
	});
}

exports.mongoLedger = function(action, query, callback) {
	MongoClient.connect(torApp.mongoShell._url, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			var dbo = db.db("acms");

			if(action == "insert") {
				console.log("Connection Established. Action="+action);
				dbo.collection("ledger").insert(query, function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "find") {
				dbo.collection("ledger").find({}).toArray(function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "update") {
				dbo.collection("ledger").update(query[0], query[1], function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}

			else if(action == "delete") {
				dbo.collection("ledger").deleteOne(query, function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}
		}
	});
}