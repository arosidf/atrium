'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	Project = mongoose.model('Project');

// =============================================================================
// helper function declaration
// =============================================================================
var findProjectData = function(req, res) {
	var resourceId = req.param('resourceId');

	Project
			.find()
			.where('resource', resourceId)
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
	findProjectData(req, res);
};
