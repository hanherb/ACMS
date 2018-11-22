const jwt = require('jsonwebtoken');

exports.assignSession = function(req, res, data) {
	req.session.email = data
	req.session.fullname = data.fullname;
	req.session.role = data.role;
	req.session.authority = data.authority;
	req.session.save();
}

exports.jwtSign = function(data) {
	var token = jwt.sign({user: data},
    	'kuda',
      	{expiresIn: '24h'}
    );
    return token;
}

exports.registerUser = function(req) {
	var obj = {
		email: req.query.email,
		fullname: req.query.fullname,
		password: req.query.password,
		role: req.query.role,
		authority: req.query.authority
	};
	return obj;
}

exports.addPost = function(req) {
	var obj = {
		title: req.query.title,
		content: req.query.content,
		date: req.query.date,
		month: req.query.month,
		year: req.query.year,
		author: req.session.fullname
	}
	return obj;
}