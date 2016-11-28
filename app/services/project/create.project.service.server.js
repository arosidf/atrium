'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	Project = mongoose.model('Project');

// =============================================================================
// helper function declaration
// =============================================================================

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	var project = new Project(req.body);
	var now = Date.now();
	project.resource = new mongoose.Types.ObjectId(req.user._id);
	project.created = now;
	project.updated = now;

	project.save(function(err) {
		if(err) {
			return res.send(400, {message: 'Something error'});
		} else {
			res.jsonp(project);
		}
	});
};
