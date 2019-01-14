var jwt = require('jsonwebtoken');

function getCookie(src, name) {
  var value = "; " + src;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

exports.verifyToken = function(req, res, next) {
	if(req.path != '/login-user') {
		console.log("authorization headers: " + req.headers.authorization);
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
					next();
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