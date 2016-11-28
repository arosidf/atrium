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
	var projectId = req.param('projectId');

	Project.remove({ _id: projectId }, function(err) {
	    if (!err) {
            return res.send(200);
	    }
	    else {
            return res.send(400, {message: 'Something error'});
	    }
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	findProjectData(req, res);
};
