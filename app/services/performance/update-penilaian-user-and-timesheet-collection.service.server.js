'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	Performance = mongoose.model('Performance');

// =============================================================================
// helper function declaration
// =============================================================================
var savePerformance = function(timesheetCollectionPerformance, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform) {
	timesheetCollectionPerformance.kriteriaPenilaianUser.ski = ski;
	timesheetCollectionPerformance.kriteriaPenilaianUser.kompetensiPendukung = kompetensiPendukung;
	timesheetCollectionPerformance.kriteriaPenilaianUser.kedisiplinan = kedisiplinan;
	timesheetCollectionPerformance.kriteriaPenilaianUser.kriteriaValue = ((parseInt(ski) + parseInt(kompetensiPendukung) + parseInt(kedisiplinan)) / (4 * 3 * 12));

	timesheetCollectionPerformance.kriteriaTimesheetCollection.collectionDate_asString = collectionDate_asString;
	timesheetCollectionPerformance.kriteriaTimesheetCollection.perform = timesheetCollectionPerform;
	timesheetCollectionPerformance.kriteriaTimesheetCollection.kriteriaValue = (timesheetCollectionPerform) ? (1/12) : 0;

	timesheetCollectionPerformance.save();
};

var updatePerformance = function(performanceId, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform) {
	Performance.findOne({_id: performanceId}).exec(function(err, timesheetCollectionPerformance) {
		if(!err) {
			savePerformance(timesheetCollectionPerformance, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform);
		}
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	var performanceId = req.body.performanceId;
	var ski = req.body.ski;
	var kompetensiPendukung = req.body.kompetensiPendukung;
	var kedisiplinan = req.body.kedisiplinan;
	var collectionDate_asString = req.body.collectionDate_asString;
	var timesheetCollectionPerform = req.body.timesheetCollectionPerform;

	console.log('performanceId: ' + performanceId);
	console.log('ski: ' + ski);
	console.log('kompetensiPendukung: ' + kompetensiPendukung);
	console.log('kedisiplinan: ' + kedisiplinan);
	console.log('collectionDate_asString: ' + collectionDate_asString);
	console.log('timesheetCollectionPerform: ' + timesheetCollectionPerform);
	
	updatePerformance(performanceId, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform);

	res.send(200);
};
