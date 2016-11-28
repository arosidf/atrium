'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	User = mongoose.model('User');

// =============================================================================
// helper function declaration
// =============================================================================
var login = function(req, res, user) {
	req.login(user, function(err) {
		if (err) {
			return res.send(400, {message: 'Something error'});
		} else {
			res.send({message: 'Ubah password berhasil'});
		}
	});
};


var saveUpdatedPassword = function(req, res, user, passwordDetails) {
	user.password = passwordDetails.newPassword;
	user.updatePassword = true;

	user.save(function(err) {
		if (err) {
			return res.send(400, {message: 'Something error'});
		} else {
			login(req, res, user);
		}
	});
};

var authenticateUser = function(req, res, user, passwordDetails) {
	if (user.authenticate(passwordDetails.currentPassword)) {
		if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
			saveUpdatedPassword(req, res, user, passwordDetails);
		} else {
			res.send(400, {message: 'Password tidak cocok'});
		}
	} else {
		res.send(400, {message: 'Password sekarang salah'});
	}
};

var findUserById = function(req, res, passwordDetails) {
	User.findById(req.user.id, function(err, user) {
		if (!err && user) {
			authenticateUser(req, res, user, passwordDetails);
		} else {
			res.send(400, {message: 'User is not found'});
		}
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res, next) {
	var passwordDetails = req.body;

	if (req.user) {
		findUserById(req, res, passwordDetails);
	} else {
		res.send(400, {message: 'User is not signed in'});
	}
};
