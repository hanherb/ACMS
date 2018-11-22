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
		'/delete-post'
	];

	for(let i = 0; i <= privatePath.length; i++) {
		if(i == privatePath.length) {
			return next();
		}
		else {
			if(req.path == privatePath[i]) {
				if(req.headers.cookie) {
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
				else {
					console.log("No Cookies Found");
				}
			}
		}
	}
}

exports.apiAuthCheck = function(req, res, next) {
	let privatePath = [
		{'path': '/get-user', 'type': 'user'},
		{'path': '/create-user', 'type': 'user'},
		{'path': '/update-user', 'type': 'user'},
		{'path': '/delete-user', 'type': 'user'},
		{'path': '/list-plugin', 'type': 'plugin'},
		{'path': '/add-plugin', 'type': 'plugin'},
		{'path': '/list-blog', 'type': 'plugin'},
		{'path': '/add-post', 'type': 'plugin'},
		{'path': '/update-post', 'type': 'plugin'},
		{'path': '/delete-post', 'type': 'plugin'},
	];

	if(req.session.email) {
		for(let i = 0; i <= privatePath.length; i++) {
			if(i == privatePath.length) {
				return next();
			}
			if(req.path == privatePath[i].path) {
				if(privatePath[i].type == 'user') {
					if(req.session.authority.api.user == 1) {
						return next();
						break;
					}
					else {
						res.json("You don't have enough permission");
						break;
					}
				}
				else if(privatePath[i].type == 'plugin') {
					if(req.session.authority.api.plugin == 1) {
						return next();
						break;
					}
					else {
						res.json("You don't have enough permission");
						break;
					}
				}
			}
		}
	}
	else {
		return next();
	}
}