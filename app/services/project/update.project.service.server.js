'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	Project = mongoose.model('Project'),
    _ = require('lodash');

// =============================================================================
// helper function declaration
// =============================================================================
var updateProject = function(req, res) {
	Project.findById(req.body._id, function(err, project) {
		if(err) {
			return res.send(400, {message: 'Something error'});
		} else {
			project = _.extend(project, req.body);
			project.updated = Date.now();
			project.save(function(err) {
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
	updateProject(req, res);
};
