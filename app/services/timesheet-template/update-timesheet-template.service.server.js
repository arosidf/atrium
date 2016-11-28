'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	TimesheetTemplate = mongoose.model('TimesheetTemplate'),
    _ = require('lodash');

// =============================================================================
// helper function declaration
// =============================================================================
var updateTimesheetTemplate = function(req, res) {
	TimesheetTemplate.findById(req.body._id, function(err, timesheetTemplate) {
		if(err) {
			return res.send(400, {message: 'Something error'});
		} else {
			timesheetTemplate = _.extend(timesheetTemplate, req.body);

			timesheetTemplate.save(function(err) {
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
	updateTimesheetTemplate(req, res);
};
