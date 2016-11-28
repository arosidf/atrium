'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	Timesheet = mongoose.model('Timesheet'),
	TimesheetTemplate = mongoose.model('TimesheetTemplate'),
	async = require('async');

// =============================================================================
// helper function declaration
// =============================================================================
var generateTimesheetList = function(res, userId, year, month, timesheetTemplate) {
	var timesheetTemplateOfSpecifiedMonth = timesheetTemplate.monthList[month];

	var newTimesheetList = [];

	for(var i = 0; i < timesheetTemplateOfSpecifiedMonth.dayList.length; i++) {
		var dayTimesheetTemplate = timesheetTemplateOfSpecifiedMonth.dayList[i];
		var day = dayTimesheetTemplate.day;

		// var statusAbsensi = (dayTimesheetTemplate.status === 'Libur') ? 'Libur' : null;
		var statusAbsensi = null;
		if(dayTimesheetTemplate.status === 'Libur' || dayTimesheetTemplate.status === 'Cuti') {
			statusAbsensi = dayTimesheetTemplate.status;
		}

		var timesheet = new Timesheet({
			tanggal_asString: (year + '-' + (parseInt(month) + 1) + '-' + day),
			statusAbsensi: statusAbsensi,
			kegiatan: dayTimesheetTemplate.notes,
			user: new mongoose.Types.ObjectId(userId),
			template: true
		});

		newTimesheetList.push(timesheet);
	}

	return newTimesheetList;
};

var reFindNewlyCreatedTimesheetAndGenerateResponse = function(res, userId, year, month) {
	Timesheet
		.find({user: userId, year: year, month: month})
		.exec(function(err, timesheetList) {
			if (err) {
				return res.send(400, {message: 'Something error'});
			} else {
				res.jsonp(timesheetList);
			}
		});
};


var saveTimesheetList = function(res, userId, year, month, timesheetList) {
	async.eachSeries(timesheetList,
		function(timesheetJson, callback) {
			var timesheetModel = new Timesheet(timesheetJson);
			timesheetModel.save(function(err) {
				if(err) {
					callback(err);
				} else {
					callback(null);
				}
			});
		}, function(err) {
			if(err) {
				return res.send(400, {message: 'Something error'});
			} else {
				reFindNewlyCreatedTimesheetAndGenerateResponse(res, userId, year, month);
			}
		});
};

var generateTimesheetListFromTimesheetTemplate = function(res, userId, year, month) {
	TimesheetTemplate.findOne({year: year})
		.exec(function(err, timesheetTemplate) {
			if(err) {
				return res.send(400, {message: 'Something error'});
			} else if(!err && timesheetTemplate) {
				var timesheetList = generateTimesheetList(res, userId, year, month, timesheetTemplate);
				saveTimesheetList(res, userId, year, month, timesheetList);
			} else {
				res.send(200, []);
			}
		});
};

var findTimesheet = function(res, userId, year, month) {
	Timesheet
		.find({user: userId, year: year, month: month})
		.exec(function(err, timesheetList) {
			if (err) {
				return res.send(400, {message: 'Something error'});
			} else if(!err && timesheetList && timesheetList.length === 0) {
				generateTimesheetListFromTimesheetTemplate(res, userId, year, month);
			} else {
				res.jsonp(timesheetList);
			}
		});
};

// =============================================================================
// exported function declaration
// =============================================================================
module.exports = {
	retrieveOrCreate: findTimesheet
};
