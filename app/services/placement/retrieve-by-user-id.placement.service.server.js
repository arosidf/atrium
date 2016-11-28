'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	Placement = mongoose.model('Placement');

// =============================================================================
// helper function declaration
// =============================================================================
var findPlacementData = function(req, res) {
	var resourceId = req.param('resourceId');

	Placement
			.find()
			.where('user', resourceId)
			.populate('client')
			.exec(function(err, result) {
				if (err) {
					return res.send(400, {message: 'Something error'});
				} else {
					res.jsonp(result);
				}
			});
};

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	findPlacementData(req, res);
};
