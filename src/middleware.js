exports.verifyToken = function(req, res, next) {
	let privatePath = [
		'/get-user',
		'/create-user',
		'/update-user',
		'/delete-user',
		'/list-plugin',
		'/add-plugin',
		'/list-blog',
		'/add-post',
		'/update-post',
		'/delete-post',
		'/api/token',
		'/api/user',
		'/api/plugin',
		'/api/blog'
	];

	for(let i = 0; i <= privatePath.length; i++) {
		if(i == privatePath.length) {
			return next();
		}
		else {
			if(req.path == privatePath[i]) {
				let cookie = req.headers.cookie;
				if(cookie.includes('jwtToken') == true) {
					cookie = cookie.split('jwtToken=')[1].split(';')[0];
					req.token = cookie;
					next();
					break;
				}
				else {
					res.sendStatus(403);
					break;
				}
			}
		}
	}
}

exports.apiAuthCheck = function(req, res, next) {
	if(req.session.email) {
		if(req.path == '/api/user') {
			if(req.session.authority.api.user == 1) {
				return next();
			}
			else {
				res.json("You don't have enough permission");
			}
		}
		if(req.path == '/api/plugin') {
			if(req.session.authority.api.plugin == 1) {
				return next();
			}
			else {
				res.json("You don't have enough permission");
			}
		}
		if(req.path == '/api/blog') {
			if(req.session.authority.api.plugin == 1) {
				return next();
			}
			else {
				res.json("You don't have enough permission");
			}
		}
	}
}