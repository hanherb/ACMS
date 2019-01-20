const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const mongodb = require('mongodb');
const mongo = require('./mongo-connect');

app.use(cookieParser());

exports.redirectIndex = function(req, res) {
	var currentUrl = 'http://' + req.get('host').split(":")[0];
	res.redirect(currentUrl + ':8080/')
}

exports.getUser = function(req, res) {
	res.json(1);
}

exports.getLog = function(req, res) {
	console.log("kuda");
	mongo.mongoLogger("find", {}, function(response) {
		res.json(response);
	});
}

exports.registerUser = function(req, res) {
	let obj = {
		email: req.body.email,
		fullname: req.body.fullname,
		password: req.body.password,
		role: req.body.role,
		authority: req.body.authority
	};
	mongo.mongoUser("insert", obj, function(response) {
		res.json(response.insertedCount);
	});
}

exports.loginUser = function(req, res) {
	let query = {email: req.body.email, password: req.body.password};
	mongo.mongoUser("find-query", query, function(response) {
		if(response[0]) {
			jwt.sign({
				id: response[0]._id,
				email: response[0].email
			},
	    	'kuda', {expiresIn: '24h'}, (err, token) => {
	    		res.json({token, response: response[0]});
	      	});
		}
		else {
			res.json("Login error");
		}
	});
}

exports.updateUser = function(req, res) {
	let query = [{email: req.body.email}, {$set: {fullname: req.body.fullname, role: req.body.role, authority: req.body.authority}}];
	mongo.mongoUser("update", query, function(response) {
		res.json(response);
	});
}

exports.deleteUser = function(req, res) {
	let query = {email: req.body.email};
	mongo.mongoUser("delete", query, function(response) {
		res.json(response);
	});
}

exports.getRole = function(req, res) {
	res.json(1);
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

exports.getPlugin = function(req, res) {
	res.json(1);
}

exports.addPlugin = function(req, res) {
	let plugin = req.body.plugin;
	let newPlugin = '';
	for(let i = 0; i <= plugin.length; i++) {
		if(i < plugin.length) {
			let query = [{name: plugin[i].name}, {$set: {name: plugin[i].name, status: plugin[i].status}}, {upsert: true}];
			mongo.mongoPlugin("update", query, function(response) {
				if(response.result.upserted) {
					newPlugin = {
						name: plugin[i].name,
						status: plugin[i].status
					};
					console.log(newPlugin);
				}
			});
		}
		else {
			setTimeout(function() {
				console.log(newPlugin);
				if(newPlugin == '')
					res.json(1)
				else 
					res.json(newPlugin);
			}, 2000);
		}
	}
}

exports.getBlog = function(req, res) {
	res.json(1);
}

exports.addPost = function(req, res) {
	let obj = {
		title: req.body.title,
		content: req.body.content,
		date: req.body.date,
		month: req.body.month,
		year: req.body.year,
		author: req.body.author
	}
	mongo.mongoBlog("insert", obj, function(response) {
		res.json(response);
	});
}

exports.updatePost = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = [{_id: o_id}, {$set: {title: req.body.title, content: req.body.content, date: req.body.date, month: req.body.month, year: req.body.year}}];
	mongo.mongoBlog("update", query, function(response) {
		res.json(response);
	});
}

exports.deletePost = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = {_id: o_id};
	mongo.mongoBlog("delete", query, function(response) {
		res.json(response);
	});
}

exports.getCommerce = function(req, res) {
	res.json(1);
}

exports.addItem = function(req, res) {
	let obj = {
		name: req.body.name,
		price: req.body.price,
		qty: req.body.qty,
		description: req.body.description,
		user: req.body.user,
		image: req.body.image
	}
	mongo.mongoCommerce("insert", obj, function(response) {
		res.json(response);
	});
}

exports.updateItem = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = [{_id: o_id}, {$set: {name: req.body.name, price: req.body.price, qty: req.body.qty, description: req.body.description, image: req.body.image}}];
	mongo.mongoCommerce("update", query, function(response) {
		console.log(response.result.nModified);
		res.json(response);
	});
}

exports.deleteItem = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = {_id: o_id};
	mongo.mongoCommerce("delete", query, function(response) {
		res.json(response);
	});
}

exports.substractQty = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = [{_id: o_id}, {$set: {qty: req.body.qty}}];
	mongo.mongoCommerce("update", query, function(response) {
		res.json(response);
	});
}

exports.getTransaction = function(req, res) {
	res.json(1);
}

exports.addTransaction = function(req, res) {
	let obj = {
		buyer_name: req.body.buyer_name,
		medicine: req.body.medicine,
		transaction_date: req.body.transaction_date,
		price: parseInt(req.body.price)
	}
	mongo.mongoTransaction("insert", obj, function(response) {
		res.json(response);
	});
}

exports.getConsult = function(req, res) {
	res.json(1);
}

exports.addConsult = function(req, res) {
	let obj = {
		doctor_name: req.body.doctor_name,
		patient_name: req.body.patient_name,
		checkin_date: req.body.checkin_date,
		status: req.body.status
	}
	mongo.mongoConsult("insert", obj, function(response) {
		res.json(response);
	});
}

exports.updateConsult = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = [{_id: o_id}, {$set: {patient_name: req.body.patient_name, doctor_name: req.body.doctor_name, checkin_date: req.body.checkin_date, consult_date: req.body.consult_date, diagnosis: req.body.diagnosis, medicine: req.body.medicine, status: req.body.status}}];
	mongo.mongoConsult("update", query, function(response) {
		res.json(response);
	});
}

exports.getSupply = function(req, res) {
	res.json(1);
}

exports.addSupply = function(req, res) {
	let obj = {
		supplier_name: req.body.supplier_name,
		medicine: req.body.medicine,
		qty: req.body.qty,
		supply_date: req.body.supply_date
	}
	mongo.mongoSupply("insert", obj, function(response) {
		res.json(response);
	});
}

exports.itemSupplied = function(req, res) {
	let o_id = new mongodb.ObjectID(req.body._id);
	let query = [{_id: o_id}, {$set: {qty: req.body.qty}}];
	mongo.mongoCommerce("update", query, function(response) {
		res.json(response);
	});
}

exports.logout = function(req, res) {
	res.clearCookie("jwtToken");
	req.session.destroy(function() {
		res.redirect('/');
	});
}