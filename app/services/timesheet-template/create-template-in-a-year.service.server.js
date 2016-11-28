'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	TimesheetTemplate = mongoose.model('TimesheetTemplate');

// =============================================================================
// helper function declaration
// =============================================================================
var isKabisat = function(year) {
	if(year % 400 === 0) {
		return true;
	} else if(year % 100 === 0) {
		return false;
	} else if(year % 4 === 0) {
		return true;
	} else {
		return false;
	}
};

var calculateCountOfDaysInAYear = function(year) {
	if(isKabisat(year)) {
		return 366;
	} else {
		return 365;
	}
};

var generateNamaHari = function(day) {
	if(day === 0) {
		return 'Minggu';
	} else if(day === 1) {
		return 'Senin';
	} else if(day === 2) {
		return 'Selasa';
	} else if(day === 3) {
		return 'Rabu';
	} else if(day === 4) {
		return 'Kamis';
	} else if(day === 5) {
		return 'Jumat';
	} else if(day === 6) {
		return 'Sabtu';
	} else {
		return '';
	}
};

var generateStatusHari = function(day) {
	if(day === 0 || day === 6) {
		return 'Libur';
	} else {
		return 'Masuk';
	}
};

var generateTimesheetTemplateObject = function(year) {
	var countOfDaysInAYear = calculateCountOfDaysInAYear(year);
	var day = new Date(year, 0, 1);	// 1 January of that year
	var milisecondsInADay = (24 * 60 * 60 * 1000);

	var timesheetTemplate = new TimesheetTemplate({
		year: year
	});

	for(var i = 1; i <= countOfDaysInAYear; i++) {
		var status = generateStatusHari(day.getDay());
		var notes = generateNamaHari(day.getDay());
		var month_asString = day.getMonth();
		var day_asString = day.getDate();
		
		timesheetTemplate.addDay(year, month_asString, day_asString, status, notes);
		
		day.setTime(day.getTime() + milisecondsInADay); // add one day for next counter
	}

	return timesheetTemplate;
};

var persistNewTimesheetTemplate = function(year, callback) {
	var timesheetTemplate = generateTimesheetTemplateObject(year);

	timesheetTemplate.save(function(err, timesheetTemplate) {
		if(err) {
			callback(err);
		} else {
			callback(null);
		}
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(year, callback) {
	TimesheetTemplate.findOne({year: year}, function(err, timesheetTemplate) {
		if(err) {
			callback(err);
		} else if(!err && timesheetTemplate) {
			callback(null);
		} else if(!err && !timesheetTemplate) {
			persistNewTimesheetTemplate(year, callback);
		}
	});
};
