'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	TimesheetTemplate = mongoose.model('TimesheetTemplate'),
	CreateTemplateInAYear = require('./create-template-in-a-year.service.server'),
	async = require('async');

// =============================================================================
// helper function declaration
// =============================================================================
var generateJsonResponse = function(yearList) {
	var currentYear = (new Date()).getFullYear();

	var jsonResponse = [];
	for(var i = 0; i < yearList.length; i++) {
		var item = {
			_id: yearList[i]._id,
			year: yearList[i].year,
			currentYear: false
		};

		if(yearList[i].year === currentYear) {
			item.currentYear = true;
		}

		jsonResponse.push(item);
	}

	return jsonResponse;
};

var generateResponse = function(req, res) {
	TimesheetTemplate.find()
		.select('year')
		.exec(function(err, yearList) {
			if(err) {
				return res.send(400, {message: 'Something error'});
			} else {
				var jsonResponse = generateJsonResponse(yearList);

				return res.send(200, jsonResponse);
			}
	 });
};

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	var thisYear = (new Date()).getFullYear();
	var nextYear = thisYear + 1;

	var yearList = [thisYear, nextYear];

	async.eachSeries(yearList, 
		function(year, callback) {
			CreateTemplateInAYear.do(year, callback);
		}, function(err) {
			if(err) {
				return res.send(400, {message: 'Something error'});
			} else {
				generateResponse(req, res);
			}
		});
};
