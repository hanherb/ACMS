const jwt = require('jsonwebtoken');
const fs = require('fs');
const mongodb = require('mongodb');
const mongo = require('./mongo-connect');

exports.getUser = function(req, res) {
	mongo.mongoUser("find", {}, function(response) {
		res.json(response);
	});
}

exports.registerUser = function(req, res) {
	let obj = {
		email: req.query.email,
		fullname: req.query.fullname,
		password: req.query.password,
		role: req.query.role,
		authority: req.query.authority
	};
	mongo.mongoUser("insert-one", obj, function(response) {
		res.json(response.insertedCount);
	});
}

exports.loginUser = function(req, res) {
	let query = {email: req.query.email, password: req.query.password};
	mongo.mongoUser("find-query", query, function(response) {
		if(response[0]) {
			let token = jwt.sign({user: response[0]},
		    	'kuda',
		      	{expiresIn: '24h'}
		    );
	        res.cookie('jwtToken', token);
			req.session.email = response[0].email
			req.session.fullname = response[0].fullname;
			req.session.role = response[0].role;
			req.session.authority = response[0].authority;
			console.log(req.session);
			res.json(response[0]);
		}
		else {
			res.json("Login error");
		}
	});
}

exports.updateUser = function(req, res) {
	let query = [{email: req.query.email}, {$set: {fullname: req.query.fullname, role: req.query.role, authority: req.query.authority}}];
	mongo.mongoUser("update-one", query, function(response) {
		res.json(response);
	});
}

exports.deleteUser = function(req, res) {
	let query = {email: req.query.email};
	mongo.mongoUser("delete-one", query, function(response) {
		res.json(response);
	});
}

exports.checkSession = function(req, res) {
	if(req.session.email) {
		let query = {email: req.session.email};
		mongo.mongoUser("session", query, function(response) {
			if(response) {
				req.session.email = response[0].email
				req.session.fullname = response[0].fullname;
				req.session.role = response[0].role;
				req.session.authority = response[0].authority;
			}
		});
		console.log(req.session);
		res.json(req.session);
	}
	else {
		res.json("no session");
	}
}

exports.listPlugin = function(req, res) {
	let folder = __dirname + '/../plugin/';
	let temp = [];
	fs.readdir(folder, (err, files) => {
		files.forEach(file => {
	 		temp.push(file);
  		});
  		res.json(temp);
	});
}

exports.addPlugin = function(req, res) {
	let plugin = req.query.plugin;
	for(let i = 0; i < plugin.name.length; i++) {
		let query = [{name: plugin.name[i]}, {$set: {name: plugin.name[i], status: plugin.status[i]}}, {upsert: true}];
		mongo.mongoPlugin("update", query, function(response) {
			
		});
	}
	res.json(1);
}

exports.listBlog = function(req, res) {
	mongo.mongoBlog("find", {}, function(response) {
		res.json(response);
	});
}

exports.addPost = function(req, res) {
	let obj = {
		title: req.query.title,
		content: req.query.content,
		date: req.query.date,
		month: req.query.month,
		year: req.query.year,
		author: req.session.fullname
	}
	mongo.mongoBlog("insert-one", obj, function(response) {
		res.json(response);
	});
}

exports.updatePost = function(req, res) {
	let query = [{title: req.query.old}, {$set: {title: req.query.title, content: req.query.content, date: req.query.date, month: req.query.month, year: req.query.year}}];
	mongo.mongoBlog("update-one", query, function(response) {
		res.json(response);
	});
}

exports.deletePost = function(req, res) {
	let query = {title: req.query.title};
	mongo.mongoBlog("delete-one", query, function(response) {
		res.json(response);
	});
}

exports.logout = function(req, res) {
	res.clearCookie("jwtToken");
	req.session.destroy(function() {
		res.redirect('/');
	});
}