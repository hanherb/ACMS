var express = require('express');
var app = express();
var session = require('express-session');
var mongodb = require('mongodb');
var mongo = require('./config/mongo-connect');
var fs = require('fs');

//GraphQL start here ------

// var express_graphql = require('express-graphql');
// var {buildSchema} = require('graphql');

// var schema = buildSchema(`
// 	type Query {
// 		user(id: String): User,
// 		kuda(nama: String): String
// 	},

// 	type User {
// 		_id: Int,
// 		fullname: String,
// 		email: String,
// 		role: String,
// 		authority: [Int]
// 	}
// `);
// var data = [];
// mongo.mongoUser("find", {}, function(response) {
// 	data.push(response);
// 	console.log(data);
// });

// var getUser = function(args) {
// 	var id = args.id;
// 	for(var i = 0; i < data.length; i++) {
// 		if(id = data[i].fullname)
// 			return data[i].email;
// 	}
// }

// var root = {
// 	kuda: function ({nama}) {
// 		var kata = "nama saya " + nama;
// 		return kata;
// 	},
// 	user: getUser
// };

// app.use('/graphql', express_graphql({
// 	schema: schema,
// 	rootValue: root,
// 	graphiql: true
// }));

//GraphQL end here ------

app.use(session({secret: 'kuda'}));

app.get('/', function(req, res, next) {
	res.redirect('/index.html');
});

//mengambil data dari collection user untuk ditampilkan di dashboard.html
app.get('/get-user', function(req, res, next) {
	mongo.mongoUser("find", {}, function(response) {
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
	mongo.mongoUser("insert-one", obj, function(response) {
		res.json(response.insertedCount);
	});
});

app.get('/login-user', function(req, res, next) {
	var query = {email: req.query.email, password: req.query.password};
	mongo.mongoUser("find-query", query, function(response) {
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
	mongo.mongoUser("find-query", query, function(response) {
		res.json(response);
	});
});

app.get('/delete-user-form', function(req, res, next) {
	var query = {email: req.query.email};
	mongo.mongoUser("find-query", query, function(response) {
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

	mongo.mongoUser("insert-one", obj, function(response) {
		res.json(response.insertedCount);
	});
});

app.get('/update-user', function(req, res, next) {
	var query = [{email: req.query.email}, {$set: {fullname: req.query.fullname, role: req.query.role, authority: req.query.authority}}];
	mongo.mongoUser("update-one", query, function(response) {
		res.json(response);
	});
});

app.get('/delete-user', function(req, res, next) {
	var query = {email: req.query.email};
	mongo.mongoUser("delete-one", query, function(response) {
		res.json(response);
	});
});

app.get('/check-session', function(req, res, next) {
	if(req.session.email) {
		var query = {email: req.session.email};
		mongo.mongoUser("session", query, function(response) {
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

app.get('/list-plugin', function(req, res, next) {
	var folder = __dirname + '/plugin/';
	var temp = [];
	fs.readdir(folder, (err, files) => {
		files.forEach(file => {
			if(file.substr(-3) == '.js')
	 			temp.push(file.slice(0, -3));
  		});
  		res.json(temp);
	})
});

app.get('/get-plugin', function(req, res, next) {
	var plugin = req.query.plugin;
	var query = {};
	mongo.mongoPlugin("find", query, function(response) {
		res.json(response);
	});
});

app.get('/add-plugin', function(req, res, next) {
	var plugin = req.query.plugin;
	for(var i = 0; i < plugin.name.length; i++) {
		var query = [{name: plugin.name[i]}, {$set: {name: plugin.name[i], status: plugin.status[i]}}, {upsert: true}];
		mongo.mongoPlugin("update", query, function(response) {
			
		});
	}
	res.json(1);
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