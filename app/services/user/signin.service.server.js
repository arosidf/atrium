'use strict';

// =============================================================================
// var declaration
// =============================================================================

// =============================================================================
// helper function declaration
// =============================================================================

// =============================================================================
// exported function declaration
// =============================================================================
var mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Signin after passport authentication
 */
exports.do = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.send(400, {message: 'Email/password salah'});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					return res.send(400, {message: 'Something error'});
				} else {
					res.jsonp(user);
				}
			});
		}
	})(req, res, next);
};
