'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	User = mongoose.model('User');

// =============================================================================
// helper function declaration
// =============================================================================
var saveUpdatedPassword = function(req, res, user, passwordDetails) {
	user.password = passwordDetails.newPassword;
	user.updatePassword = true;

	user.save(function(err) {
		if (err) {
			return res.send(400, {message: 'Something error'});
		} else {
			res.send({message: 'Ubah password berhasil'});
		}
	});
};

var findUserById = function(req, res, passwordDetails) {
	User.findById(passwordDetails.userId, function(err, user) {
		if (!err && user) {
			saveUpdatedPassword(req, res, user, passwordDetails);
		} else {
			res.send(400, {message: 'Something error'});
		}
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res, next) {
	var passwordDetails = req.body;

	findUserById(req, res, passwordDetails);
};
