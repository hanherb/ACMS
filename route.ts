const express = require('express');
const app = express();
const session = require('express-session');
const jwt = require('jsonwebtoken');
const mongodb = require('mongodb');
const mongo = require('./config/mongo-connect');
const fs = require('fs');

const router = express.Router();

router.route('/').get(function(req, res) {
	res.redirect('/index.html');
});

router.route('/api/post').get(function(req, res) {
	console.log(req.token);
	jwt.verify(req.token, 'kuda', function(err, authData) {
		if(err) {
			res.json({
				error: err
			});
		}
		else {
			res.json({
				text: 'Post here',
				authData
			});
		}
	});
});

router.route('/api/login').get(function(req, res) {
	const user = {
		fullname: req.query.fullname,
		email: req.query.email
	}

	jwt.sign({user: user}, 'kuda', function(err, token) {
		res.cookie('jwtToken', token, { maxAge: 900000, httpOnly: true });
		res.json({
			token: token
		});
	});
});

//mengambil data dari collection user untuk ditampilkan di dashboard.html
router.route('/get-user').get(function(req, res) {
	mongo.mongoUser("find", {}, function(response) {
		res.json(response);
	});
});
//--

router.route('/register-user').get(function(req, res) {
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

router.route('/login-user').get(function(req, res) {
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

router.route('/update-user-form').get(function(req, res) {
	var query = {email: req.query.email};
	mongo.mongoUser("find-query", query, function(response) {
		res.json(response);
	});
});

router.route('/delete-user-form').get(function(req, res) {
	var query = {email: req.query.email};
	mongo.mongoUser("find-query", query, function(response) {
		res.json(response);
	});
});

router.route('/create-user').get(function(req, res) {
	var obj = {
		email: req.query.email,
		fullname: req.query.fullname,
		password: req.query.password,
		role: req.query.role,
		authority: req.query.authority
	}

	mongo.mongoUser("insert-one", obj, function(response) {
		res.json(response.insertedCount);
	});
});

router.route('/update-user').get(function(req, res) {
	var query = [{email: req.query.email}, {$set: {fullname: req.query.fullname, role: req.query.role, authority: req.query.authority}}];
	mongo.mongoUser("update-one", query, function(response) {
		res.json(response);
	});
});

router.route('/delete-user').get(function(req, res) {
	var query = {email: req.query.email};
	mongo.mongoUser("delete-one", query, function(response) {
		res.json(response);
	});
});

router.route('/check-session').get(function(req, res) {
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

router.route('/list-plugin').get(function(req, res) {
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

router.route('/get-plugin').get(function(req, res) {
	var plugin = req.query.plugin;
	var query = {};
	mongo.mongoPlugin("find", query, function(response) {
		res.json(response);
	});
});

router.route('/add-plugin').get(function(req, res) {
	var plugin = req.query.plugin;
	for(var i = 0; i < plugin.name.length; i++) {
		var query = [{name: plugin.name[i]}, {$set: {name: plugin.name[i], status: plugin.status[i]}}, {upsert: true}];
		mongo.mongoPlugin("update", query, function(response) {
			
		});
	}
	res.json(1);
});

router.route('/list-blog').get(function(req, res) {
	mongo.mongoBlog("find", {}, function(response) {
		res.json(response);
	});
});

router.route('/add-post').get(function(req, res) {
	var obj = {
		title: req.query.title,
		content: req.query.content,
		date: req.query.date,
		month: req.query.month,
		year: req.query.year
	}
	mongo.mongoBlog("insert-one", obj, function(response) {
		res.json(response.insertedCount);
	});
});

router.route('/update-post').get(function(req, res) {
	var query = [{title: req.query.old}, {$set: {title: req.query.title, content: req.query.content}}];
	mongo.mongoBlog("update-one", query, function(response) {
		res.json(response);
	});
});

router.route('/delete-post').get(function(req, res) {
	var query = {title: req.query.title};
	mongo.mongoBlog("delete-one", query, function(response) {
		res.json(response);
	});
});

router.route('/logout').get(function(req, res) {
	res.clearCookie("jwtToken");
	req.session.destroy(function() {
		res.redirect('/');
	});
});

module.exports = router;