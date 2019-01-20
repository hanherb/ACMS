const mongodb = require('mongodb');
const mongo = require('./mongo-connect');
const jwt = require('jsonwebtoken');

function logger(req, res ,next) {
	let path = req.path;
	let userId = req.headers.user_session;
	let currentdate = new Date();
	let date = currentdate.getDate();
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	let month = monthNames[(currentdate.getMonth())];
	let year = currentdate.getFullYear();
	let second = currentdate.getSeconds();
    let minute = currentdate.getMinutes();
    let hour = currentdate.getHours();
	let fulldate = date + " " + month + " " + year + " @ " + hour + ":" + minute + ":" + second;
	mongo.mongoLogger("insert", {path: path, userId: userId, date: fulldate}, function(response) {
		next();
	});
}

exports.verifyToken = function(req, res, next) {
	if(req.path != '/login-user' && req.path != '/register-user' && req.path != '/get-log' && req.path != '/get-user') {
		// console.log("authorization headers: " + req.headers.authorization);
		// console.log("user session headers: " + req.headers.user_session);
		const bearerHeader = req.headers['authorization'];
		if(typeof bearerHeader !== 'undefined') {
			const bearer = bearerHeader.split(' ');
			const bearerToken = bearer[1];

			req.token = bearerToken;
			jwt.verify(req.token, 'kuda', (err, authData) => {
				if(err) {
					res.sendStatus(403);
				}
				else {
					logger(req, res, next);
				}
			});
		}
		else {
			res.sendStatus(403);
		}
	}
	else {
		next();
	}
}