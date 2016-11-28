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
	User.find({roles: 'resource'}).select('nip name joinDate_asString email statusKepegawaian lastPlacement')
								  .populate('lastPlacement')
								  .exec(function(err, daftarResource) {
		if (err) {
			return res.send(400, {message: 'Something error'});
		} else {
			res.jsonp(daftarResource);
		}
	});
};
