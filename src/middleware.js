exports.verifyToken = function(req, res, next) {
	let privatePath = [
		'/get-user',
		'/update-user-form',
		'/delete-user-form',
		'/create-user',
		'/update-user',
		'/delete-user',
		'/list-plugin',
		'/get-plugin',
		'/add-plugin',
		'/list-blog',
		'/add-post',
		'/update-post',
		'/delete-post',
		'/api/post'
	];

	for(let i = 0; i <= privatePath.length; i++) {
		if(i == privatePath.length) {
			return next();
		}
		else {
			if(req.path == privatePath[i]) {
				console.log(req.headers.cookie);
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