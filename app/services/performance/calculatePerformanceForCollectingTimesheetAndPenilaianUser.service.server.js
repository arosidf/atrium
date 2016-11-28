'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Performance = mongoose.model('Performance'),
	Timesheet = mongoose.model('Timesheet'),
	TimesheetTemplate = mongoose.model('TimesheetTemplate'),
	SystemConfig = mongoose.model('SystemConfig');

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

var findPerformance = function(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform, pengali, totalWorkingDays) {
	Performance.findOne({resource: resource, year: year, month: month}).exec(function(err, timesheetCollectionPerformance) {
		if(!err) {
			if(timesheetCollectionPerformance === undefined || timesheetCollectionPerformance === null) {
				timesheetCollectionPerformance = new Performance({
					resource: resource, 
					year: year, 
					month: month,
					totalWorkingDays: totalWorkingDays,
					rumusAkhir: pengali
				});
			} 

			savePerformance(timesheetCollectionPerformance, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform);
		}
	});
};

var findTimesheetTemplateByYear = function(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform, pengali) {
	TimesheetTemplate.findOne({year: year}).exec(function(err, timesheetTemplate) {
		if(!err && timesheetTemplate !== null) {
			var totalWorkingDays = timesheetTemplate.totalWorkingDays;

			findPerformance(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform, pengali, totalWorkingDays);
		}
	});
};

var findSystemConfigPengaliPerformance = function(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform) {
	SystemConfig.findOne({key: SystemConfig.PENGALI_PERFORMANCE}, function(err, systemConfig) {
		if(!err) {
			var pengali = systemConfig.value;

			findTimesheetTemplateByYear(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform, pengali);
		}
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
module.exports = {
	doCalculation: findSystemConfigPengaliPerformance
};
