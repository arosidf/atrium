'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	dateConverterUtils = require('../../utils/date-converter-utils.service.server'),
	timesheetHtmlGenerator = require('./html-generator.timesheet.service.server');

// =============================================================================
// helper function declaration
// =============================================================================

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	var userId = req.user._id;
	var startDate_asString = req.param('startDate');
	var endDate_asString = req.param('endDate');
	var startDate_asDate = dateConverterUtils.convertFromStringToDate(startDate_asString);
	var endDate_asDate = dateConverterUtils.convertFromStringToDate(endDate_asString);

	var namaPemeriksa = '(..............................)';
	var namaPenyetuju = '(..............................)';

	timesheetHtmlGenerator.do(res, userId, startDate_asDate, endDate_asDate, namaPemeriksa, namaPenyetuju);
};
