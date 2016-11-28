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
exports.do = function(req, res, next, id) {
	User.findOne({_id: id}).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return next(new Error('Failed to load User ' + id));
		}
		
		req.profile = user;
		next();
	});
};
