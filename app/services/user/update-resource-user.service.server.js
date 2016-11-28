'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
    _ = require('lodash');

// =============================================================================
// helper function declaration
// =============================================================================
var updateResourceUser = function(req, res) {
	User.findById(req.body._id, function(err, user) {
		if(err) {
			return res.send(400, {message: 'Something error'});
		} else {
			user.nip = req.body.nip;
			user.name = req.body.name;
			user.statusKepegawaian = req.body.statusKepegawaian;
			user.joinDate_asString = req.body.joinDate_asString;
			user.updatePassword = false;

			user.save(function(err) {
				if(err) {
					return res.send(400, {message: 'Something error'});
				} else {
					res.send(200);
				}
			});
		}
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	updateResourceUser(req, res);
};
