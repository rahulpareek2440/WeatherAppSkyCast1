var jwt = require('jsonwebtoken');
	tokenSecret = 'reallyreallysecret';

// Generates a token from supplied payload
module.exports.issue = function(payload){
	return jwt.sign(
		payload,
		tokenSecret,
		{
			expiresIn: '30d'	// seconds
		}
	);
};

module.exports.verify = function(token, callback){
	return jwt.verify(
		token,
		tokenSecret,
		{},
		callback
	);
};
