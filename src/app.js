var express = require('express');
var app = express();
var session = require('express-session');
var mongodb = require('mongodb');

//MongoDB setup and check
var MongoClient = mongodb.MongoClient;
var mongourl = 'mongodb://localhost:27017/';

MongoClient.connect(mongourl, function(err, db) {
	if(err) {
		console.log("Error: ", err);
	}
	else {
		console.log("Connection Established");
	}
});
//--

app.use(session({secret: 'kuda'}));

app.get('/', function(req, res, next) {
	res.redirect('/index.html');
});

//mengambil data dari collection user untuk ditampilkan di dashboard.html
app.get('/get-user', function(req, res, next) {
	MongoClient.connect(mongourl, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			console.log("Connection Established");
			var dbo = db.db("kliling");
			dbo.collection("user").find({}).toArray(function(err, result) {
				if (err) throw err;
				console.log(result);
			    res.json(result);
		    	db.close();
		  	});
		}
	});
});
//--

app.get('/register-user', function(req, res, next) {
	var obj = {
		email: req.query.email,
		fullname: req.query.fullname,
		password: req.query.password,
		role: "user",
		authority: {
			"read": 0,
			"create": 0,
			"update": 0,
			"delete": 0
		}
		
	}
	MongoClient.connect(mongourl, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			console.log("Connection Established");
			var dbo = db.db("kliling");
			dbo.collection("user").insertOne(obj, function(err, result) {
				if (err) throw err;
			    res.json(result.insertedCount);
		    	db.close();
		  	});
		}
	});
});

app.get('/login-user', function(req, res, next) {
	MongoClient.connect(mongourl, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			console.log("Connection Established");
			var dbo = db.db("kliling");
			var query = {email: req.query.email, password: req.query.password};
			dbo.collection("user").find(query).toArray(function(err, result) {
				if (err) throw err;
				if(result[0]) {
					req.session.email = result[0].email;
					req.session.fullname = result[0].fullname;
					req.session.role = result[0].role;
					req.session.authority = result[0].authority;
				}
			    res.json(result);
		    	db.close();
		  	});
		}
	});
});

app.get('/update-user-form', function(req, res, next) {
	MongoClient.connect(mongourl, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			console.log("Connection Established");
			var dbo = db.db("kliling");
			var query = {email: req.query.email};
			dbo.collection("user").find(query).toArray(function(err, result) {
				if (err) throw err;
			    res.json(result);
		    	db.close();
		  	});
		}
	});
});

app.get('/delete-user-form', function(req, res, next) {
	MongoClient.connect(mongourl, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			console.log("Connection Established");
			var dbo = db.db("kliling");
			var query = {email: req.query.email};
			dbo.collection("user").find(query).toArray(function(err, result) {
				if (err) throw err;
			    res.json(result);
		    	db.close();
		  	});
		}
	});
});

app.get('/create-user', function(req, res, next) {
	var obj = {
		email: req.query.email,
		fullname: req.query.fullname,
		password: req.query.password,
		role: req.query.role,
		authority: req.query.authority
	}

	MongoClient.connect(mongourl, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			console.log("Connection Established");
			var dbo = db.db("kliling");
			dbo.collection("user").insertOne(obj, function(err, result) {
				if (err) throw err;
			    res.json(result.insertedCount);
		    	db.close();
		  	});
		}
	});
});

app.get('/update-user', function(req, res, next) {
	MongoClient.connect(mongourl, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			console.log("Connection Established");
			var dbo = db.db("kliling");
			var query = {email: req.query.email};
			var value = {$set: {fullname: req.query.fullname, role: req.query.role, authority: req.query.authority}};
			dbo.collection("user").updateOne(query, value, function(err, result) {
				if (err) throw err;
			    res.json(result);
		    	db.close();
		  	});
		}
	});
});

app.get('/delete-user', function(req, res, next) {
	MongoClient.connect(mongourl, function(err, db) {
		if(err) {
			console.log("Error: ", err);
		}
		else {
			console.log("Connection Established");
			var dbo = db.db("kliling");
			var query = {email: req.query.email};
			dbo.collection("user").deleteOne(query, function(err, result) {
				if (err) throw err;
				console.log(result);
			    res.json(result);
		    	db.close();
		  	});
		}
	});
});

app.get('/check-session', function(req, res, next) {
	if(req.session.email) {
		MongoClient.connect(mongourl, function(err, db) {
			if(err) {
				console.log("Error: ", err);
			}
			else {
				console.log("Connection Established");
				var dbo = db.db("kliling");
				var query = {email: req.session.email};
				dbo.collection("user").find(query).toArray(function(err, result) {
					if (err) throw err;
					if(result[0]) {
						req.session.email = result[0].email;
						req.session.fullname = result[0].fullname;
						req.session.role = result[0].role;
						req.session.authority = result[0].authority;
					}
			    	db.close();
			  	});
			}
		});
		res.json(req.session);
	}
	else {
		res.json("no session");
	}
});

app.get('/logout', function(req, res, next) {
	req.session.destroy(function() {
		res.redirect('/');
	});
});

app.use(express.static(__dirname + '/public',{ redirect : false }));

var server = app.listen(3000, function () {
	var port = server.address().port;

  	console.log('App listening at port:', port);
});