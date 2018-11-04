var express = require('express');
var app = express();
var session = require('express-session');
var mongodb = require('mongodb');
var mongo = require('./config/mongo-connect');

app.use(session({secret: 'kuda'}));

app.get('/', function(req, res, next) {
	res.redirect('/index.html');
});

//mengambil data dari collection user untuk ditampilkan di dashboard.html
app.get('/get-user', function(req, res, next) {
	mongo.mongoConnect("find", {}, function(response) {
		res.json(response);
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
	mongo.mongoConnect("insert-one", obj, function(response) {
		res.json(response.insertedCount);
	});
});

app.get('/login-user', function(req, res, next) {
	var query = {email: req.query.email, password: req.query.password};
	mongo.mongoConnect("find-query", query, function(response) {
		if(response[0]) {
			req.session.email = response[0].email;
			req.session.fullname = response[0].fullname;
			req.session.role = response[0].role;
			req.session.authority = response[0].authority;
			res.json(response[0]);
		}
		else {
			res.json("Login error");
		}
	});
});

app.get('/update-user-form', function(req, res, next) {
	var query = {email: req.query.email};
	mongo.mongoConnect("find-query", query, function(response) {
		res.json(response);
	});
});

app.get('/delete-user-form', function(req, res, next) {
	var query = {email: req.query.email};
	mongo.mongoConnect("find-query", query, function(response) {
		res.json(response);
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
	console.log(obj.authority);

	mongo.mongoConnect("insert-one", obj, function(response) {
		res.json(response.insertedCount);
	});
});

app.get('/update-user', function(req, res, next) {
	var query = [{email: req.query.email}, {$set: {fullname: req.query.fullname, role: req.query.role, authority: req.query.authority}}];
	mongo.mongoConnect("update-one", query, function(response) {
		res.json(response);
	});
});

app.get('/delete-user', function(req, res, next) {
	var query = {email: req.query.email};
	mongo.mongoConnect("delete-one", query, function(response) {
		res.json(response);
	});
});

app.get('/check-session', function(req, res, next) {
	if(req.session.email) {
		var query = {email: req.session.email};
		mongo.mongoConnect("session", query, function(response) {
			if(response) {
				req.session.email = response[0].email;
				req.session.fullname = response[0].fullname;
				req.session.role = response[0].role;
				req.session.authority = response[0].authority;
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