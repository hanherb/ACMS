const jwt = require('jsonwebtoken');
const fs = require('fs');
const mongodb = require('mongodb');
const mongo = require('./mongo-connect');
const Promise = require('promise');

exports.redirectIndex = function(req, res) {
	var currentUrl = 'http://' + req.get('host').split(":")[0];
	res.redirect(currentUrl + ':3001/')
}

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

exports.getPlugin = function(req, res) {
	mongo.mongoPlugin("find", {}, function(response) {
		res.json(response);
	});
}

exports.addPlugin = function(req, res) {
	let plugin = req.query.plugin;
	let newPlugin = '';
	for(let i = 0; i <= plugin.name.length; i++) {
		if(i < plugin.name.length) {
			let query = [{name: plugin.name[i]}, {$set: {name: plugin.name[i], status: plugin.status[i]}}, {upsert: true}];
			mongo.mongoPlugin("update", query, function(response) {
				if(response.result.upserted) {
					newPlugin = {
						name: plugin.name[i],
						status: plugin.status[i]
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
		author: req.query.author
	}
	console.log(obj.author);
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

exports.addItem = function(req, res) {
	let obj = {
		name: req.query.name,
		price: req.query.price,
		qty: req.query.qty,
		description: req.query.description,
		user: req.query.user,
		image: req.query.image
	}
	mongo.mongoCommerce("insert-one", obj, function(response) {
		res.json(response);
	});
}

exports.updateItem = function(req, res) {
	let query = [{name: req.query.old}, {$set: {name: req.query.name, price: req.query.price, qty: req.query.qty, description: req.query.description, image: req.query.image}}];
	mongo.mongoCommerce("update-one", query, function(response) {
		res.json(response);
	});
}

exports.deleteItem = function(req, res) {
	let query = {name: req.query.name};
	mongo.mongoCommerce("delete-one", query, function(response) {
		res.json(response);
	});
}

exports.buyItem = function(req, res) {
	let query = [{name: req.query.name}, {$set: {qty: req.query.qty}}];
	mongo.mongoCommerce("update-one", query, function(response) {
		res.json(response);
	});
}

exports.addTransaction = function(req, res) {
	let obj = {
		patient_name: req.query.patient_name,
		medicine: req.query.medicine,
		transaction_date: req.query.transaction_date,
		price: parseInt(req.query.price)
	}
	mongo.mongoTransaction("insert-one", obj, function(response) {
		res.json(response);
	});
}

exports.addConsult = function(req, res) {
	let obj = {
		doctor_name: req.query.doctor_name,
		patient_name: req.query.patient_name,
		checkin_date: req.query.checkin_date,
		medicine: req.query.medicine,
		status: req.query.status
	}
	mongo.mongoConsult("insert-one", obj, function(response) {
		res.json(response);
	});
}

exports.updateConsult = function(req, res) {
	let query = [{patient_name: req.query.patient_name}, {$set: {patient_name: req.query.patient_name, doctor_name: req.query.doctor_name, checkin_date: req.query.checkin_date, medicine: req.query.medicine, status: req.query.status}}];
	mongo.mongoConsult("update-one", query, function(response) {
		res.json(response);
	});
}

exports.updateSpecificConsult = function(req, res) {
	let query = [{patient_name: req.query.patient_name, status: req.query.status}, {$set: {patient_name: req.query.patient_name, doctor_name: req.query.doctor_name, checkin_date: req.query.checkin_date, medicine: req.query.medicine, status: req.query.status}}];
	mongo.mongoConsult("update-one", query, function(response) {
		res.json(response);
	});
}

exports.updateStatusConsult = function(req, res) {
	let query = [{patient_name: req.query.patient_name, status: req.query.prevStatus}, {$set: {patient_name: req.query.patient_name, status: req.query.status}}];
	mongo.mongoConsult("update-one", query, function(response) {
		res.json(response);
	});
}

exports.addConsultDate = function(req, res) {
	let query = [{patient_name: req.query.patient_name, status: req.query.status}, {$set: {patient_name: req.query.patient_name, consult_date: req.query.consult_date}}];
	mongo.mongoConsult("update-one", query, function(response) {
		console.log(response);
		res.json(response);
	});
}

exports.addSupply = function(req, res) {
	let obj = {
		supplier_name: req.query.supplier_name,
		medicine: req.query.medicine,
		qty: req.query.qty,
		supply_date: req.query.supply_date
	}
	mongo.mongoSupply("insert-one", obj, function(response) {
		res.json(response);
	});
}

exports.itemSupplied = function(req, res) {
	let query = [{name: req.query.medicine}, {$set: {qty: req.query.qty}}];
	mongo.mongoCommerce("update-one", query, function(response) {
		res.json(response);
	});
}

exports.logout = function(req, res) {
	res.clearCookie("jwtToken");
	req.session.destroy(function() {
		res.redirect('/');
	});
}