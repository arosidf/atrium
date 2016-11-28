'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	Client = mongoose.model('Client'),
	User = mongoose.model('User');

// =============================================================================
// helper function declaration
// =============================================================================

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	User.find({roles: 'resource'}).select('nip name email statusKepegawaian lastPlacement')
								  .where({statusKepegawaian: 'active'})
								  .populate('lastPlacement')
								  .exec(function(err, daftarResource) {
		if (err) {
			return res.send(400, {message: 'Something error'});
		} else {
			Client.populate(daftarResource, {
				path: 'lastPlacement.client'
			}, function() {
				res.jsonp(daftarResource);
			});
		}
	});
};
