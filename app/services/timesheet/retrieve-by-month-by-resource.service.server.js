'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	Timesheet = mongoose.model('Timesheet'),
	retrieveOrCreateTimesheet = require('./retrieve-or-create-timesheet.service.server');

// =============================================================================
// helper function declaration
// =============================================================================

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	var userId = req.param('resourceId');
	var year = req.query.year;
	var month = req.query.month;

	retrieveOrCreateTimesheet.retrieveOrCreate(res, userId, year, month);
};
