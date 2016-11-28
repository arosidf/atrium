'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	Performance = mongoose.model('Performance');

// =============================================================================
// helper function declaration
// =============================================================================
var findPerformance = function(req, res) {
	var currentYear = (new Date()).getFullYear();

	Performance.find({resource: req.user._id, year: currentYear}).exec(function(err, performanceList) {
		if (err) {
			return res.send(400, {message: 'Something error'});
		} else {			
			res.jsonp({
				year: currentYear,
				performanceList: performanceList
			});
		}
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	findPerformance(req, res);
};
