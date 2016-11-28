'use strict';

// =============================================================================
// var declaration
// =============================================================================

// =============================================================================
// helper function declaration
// =============================================================================
var convertFromDateToString = function(date) {
	var returnValue = null;

	if(date !== undefined && date !== null) {
		var year = date.getFullYear();
		var month = (date.getMonth() + 1);
		var day = date.getDate();

		returnValue = (year + '-' + month + '-' + day);
		
	}

	return returnValue;
};

var convertFromStringToDate = function(dateAsString) {
	var returnValue = null;

	if(dateAsString !== undefined && dateAsString !== null) {
		var year = dateAsString.split('-')[0];			// Start from 1.
		var month = (dateAsString.split('-')[1] - 1); 	// Start from 0. January is 0
		var day = dateAsString.split('-')[2]; 			// Start from 1.

		returnValue = new Date(year, month, day);
	}

	return returnValue;
};

var todayAsString = function() {
	return this.convertFromDateToString(new Date());
};

var todayAsDate = function() {
	return this.convertFromStringToDate(this.todayAsString());
};

// =============================================================================
// exported function declaration
// =============================================================================
module.exports = {
	convertFromDateToString: convertFromDateToString,
	convertFromStringToDate: convertFromStringToDate,
	todayAsString: todayAsString,
	todayAsDate: todayAsDate
};
