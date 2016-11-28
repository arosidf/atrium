'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	User = mongoose.model('User');

// =============================================================================
// helper function declaration
// =============================================================================

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	var user = new User(req.body);
	user.roles = ['resource'];
	user.provider = 'local';
	user.updatePassword = true;

	user.save(function(err) {
		if(err) {
			return res.send(400, {message: 'Something error'});
		} else {
			res.jsonp(user);
		}
	});
};
