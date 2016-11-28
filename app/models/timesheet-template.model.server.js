'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// =============================================================================
// DayTimesheetTemplateSchema
// =============================================================================
var DayTimesheetTemplateSchema = new Schema({
	asString: {
		type: String
	},
	day: {
		type: Number
	},
	status: {
		type: String
	},
	notes: {
		type: String
	}
});

mongoose.model('DayTimesheetTemplate', DayTimesheetTemplateSchema);

// =============================================================================
// MonthTimesheetTemplateSchema
// =============================================================================
var MonthTimesheetTemplateSchema = new Schema({
	// Start from 0. January is 0
	month: {
		type: Number
	},
	dayList: [DayTimesheetTemplateSchema]
});

MonthTimesheetTemplateSchema.methods.addDay = function(year, month, day, status, notes) {
	var DayTimesheetTemplate = mongoose.model('DayTimesheetTemplate');

	var dayTimesheetTemplate = new DayTimesheetTemplate({
		asString: (year + '-' + month + '-' + day),
		day: day,
		status: status,
		notes: notes
	});

	this.dayList.push(dayTimesheetTemplate);
};

mongoose.model('MonthTimesheetTemplate', MonthTimesheetTemplateSchema);

// =============================================================================
// TimesheetTemplateSchema
// =============================================================================
var TimesheetTemplateSchema = new Schema({
	// Start from 1
	year: {
		type: Number
	},
	totalDays: {
		type: Number
	},
	totalWorkingDays: {
		type: Number
	},
	totalHolidays: {
		type: Number
	},
	monthList: [MonthTimesheetTemplateSchema]
});

TimesheetTemplateSchema.methods.retrieveMonth = function(month) {
	var monthTimesheetTemplate = null;

	for(var i = 0; i < this.monthList.length; i++) {
		if(this.monthList[i].month === month) {
			monthTimesheetTemplate = this.monthList[i];
		}
	}

	if(monthTimesheetTemplate === null) {
		var MonthTimesheetTemplate = mongoose.model('MonthTimesheetTemplate');
		monthTimesheetTemplate = new MonthTimesheetTemplate({
			month: month
		});

		this.monthList.push(monthTimesheetTemplate);
	}


	return monthTimesheetTemplate;
};

TimesheetTemplateSchema.methods.addDay = function(year, month, day, status, notes) {
	var monthTimesheetTemplate = this.retrieveMonth(month);

	monthTimesheetTemplate.addDay(year, month, day, status, notes);
};

TimesheetTemplateSchema.methods.calculateDays = function() {
	var totalDays = 0;
	var totalWorkingDays = 0;
	var totalHolidays = 0;

	for(var i = 0; i < this.monthList.length; i++) {
		for(var j = 0; j < this.monthList[i].dayList.length; j++) {
			totalDays++;
			if(this.monthList[i].dayList[j].status === 'Masuk') {
				totalWorkingDays++;
			} else if(this.monthList[i].dayList[j].status === 'Libur') {
				totalHolidays++;
			}
		}
	}

	this.totalDays = totalDays;
	this.totalWorkingDays = totalWorkingDays;
	this.totalHolidays = totalHolidays;
};

TimesheetTemplateSchema.pre('save', function(next) {
	this.calculateDays();

	next();
});

mongoose.model('TimesheetTemplate', TimesheetTemplateSchema);
