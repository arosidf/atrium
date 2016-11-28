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
	var resourceId = req.param('resourceId');

	User.findOne({_id: resourceId})
		.select('nip name email statusKepegawaian lastPlacement joinDate_asString')
		.populate('lastPlacement')
		.exec(function(err, resource) {
			if (err) {
				return res.send(400, {message: 'Something error'});
			} else {
				res.jsonp(resource);
			}
		});
};
