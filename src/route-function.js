const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const mongodb = require('mongodb');
const mongo = require('./mongo-connect');

const registerPlugin = require('../plugin/register/register');
const loginPlugin = require('../plugin/login/login');
const blogPlugin = require('../plugin/blog/blog');
const commercePlugin = require('../plugin/commerce/commerce');
const consultPlugin = require('../plugin/consult/consult');
const supplyPlugin = require('../plugin/supply/supply');
const accountPlugin = require('../plugin/account/account');

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
	registerPlugin.register(req, res);
}

exports.loginUser = function(req, res) {
	loginPlugin.login(req, res);
}

exports.updateUser = function(req, res) {
	let query = [{email: req.body.email}, {$set: {
		fullname: req.body.fullname, 
		role: req.body.role, 
		authority: req.body.authority
	}}];
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
			let query = [{name: plugin[i].name}, {$set: {
				name: plugin[i].name, 
				status: plugin[i].status
			}}, {upsert: true}];
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
	blogPlugin.add(req, res);
}

exports.updatePost = function(req, res) {
	blogPlugin.update(req, res);
}

exports.deletePost = function(req, res) {
	blogPlugin.delete(req, res);
}

exports.getCommerce = function(req, res) {
	res.json(1);
}

exports.addItem = function(req, res) {
	commercePlugin.add(req, res);
}

exports.updateItem = function(req, res) {
	commercePlugin.update(req, res);
}

exports.deleteItem = function(req, res) {
	commercePlugin.delete(req, res);
}

exports.substractQty = function(req, res) {
	commercePlugin.substractQty(req, res);
}

exports.getTransaction = function(req, res) {
	res.json(1);
}

exports.addTransaction = function(req, res) {
	commercePlugin.addTransaction(req, res);
}

exports.getConsult = function(req, res) {
	res.json(1);
}

exports.addConsult = function(req, res) {
	consultPlugin.add(req, res);
}

exports.updateConsult = function(req, res) {
	consultPlugin.update(req, res);
}

exports.getSupply = function(req, res) {
	res.json(1);
}

exports.addSupply = function(req, res) {
	supplyPlugin.add(req, res);
}

exports.itemSupplied = function(req, res) {
	supplyPlugin.itemSupplied(req, res);
}

exports.getAccount = function(req, res) {
	res.json(1);
}

exports.addAccount = function(req, res) {
	accountPlugin.add(req, res);
}

exports.updateAccount = function(req, res) {
	accountPlugin.update(req, res);
}

exports.deleteAccount= function(req, res) {
	accountPlugin.delete(req, res);
}

exports.getLedger = function(req, res) {
	res.json(1);
}

exports.addLedger = function(req, res) {
	accountPlugin.addLedger(req, res);
}

exports.logout = function(req, res) {
	res.json(1);
}