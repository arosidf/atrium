'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	Timesheet = mongoose.model('Timesheet'),
	_ = require('lodash');

var calculatePerformanceForKriteriaAbsensiAndBillable = require('../performance/calculatePerformanceForKriteriaAbsensiAndBillable.service.server');

// =============================================================================
// helper function declaration
// =============================================================================
var updateTimesheet = function(req, res) {
	Timesheet.findById(req.body._id, function(err, timesheet) {
		if(err) {
			return res.send(400, {message: 'Something error'});
		} else {
			timesheet = _.extend(timesheet, req.body);
			
			timesheet.save(function(err) {
				if(err) {
					return res.send(400, {message: 'Something error'});
				} else {
					calculatePerformanceForKriteriaAbsensiAndBillable.doCalculation(timesheet.user, timesheet.year, timesheet.month);

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
	updateTimesheet(req, res);
};
