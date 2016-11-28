'use strict';

// =============================================================================
// var declaration
// =============================================================================
var calculatePerformanceForCollectingTimesheetAndPenilaianUser = require('./calculatePerformanceForCollectingTimesheetAndPenilaianUser.service.server');

// =============================================================================
// helper function declaration
// =============================================================================

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	var resource = req.body.resource;
	var year = req.body.year;
	var month = req.body.month;
	var ski = req.body.ski;
	var kompetensiPendukung = req.body.kompetensiPendukung;
	var kedisiplinan = req.body.kedisiplinan;
	var collectionDate_asString = req.body.collectionDate_asString;
	var timesheetCollectionPerform = req.body.timesheetCollectionPerform;

	calculatePerformanceForCollectingTimesheetAndPenilaianUser.doCalculation(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform);

	res.send(200);
};
