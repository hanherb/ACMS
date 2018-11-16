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

			else if(action == "insert-one") {
				console.log("Connection Established. Action="+action);
				dbo.collection("user").insertOne(query, function(err, result) {
					if(callback)
						return callback(result);
			    	db.close();
			  	});
			}

			else if(action == "update-one") {
				console.log("Connection Established. Action="+action);
				dbo.collection("user").updateOne(query[0], query[1], function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}

			else if(action == "delete-one") {
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

			if(action == "insert-one") {
				console.log("Connection Established. Action="+action);
				dbo.collection("blog").insertOne(query, function(err, result) {
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

			else if(action == "update-one") {
				dbo.collection("blog").updateOne(query[0], query[1], function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}

			else if(action == "delete-one") {
				dbo.collection("blog").deleteOne(query, function(err, result) {
					if(callback)
						return callback(result);
					db.close();
				});
			}
		}
	});
}