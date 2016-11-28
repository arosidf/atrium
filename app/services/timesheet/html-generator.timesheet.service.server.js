'use strict';

// =============================================================================
// var declaration
// =============================================================================
var reportTemplateLocation = 'app/views/report-template/timesheet-template.html';
var reportTemplateContent = null;
var reporter = null;

var jsrender = require('node-jsrender'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	Timesheet = mongoose.model('Timesheet'),
	Placement = mongoose.model('Placement'),
	Client = mongoose.model('Client'),
	User = mongoose.model('User');

// =============================================================================
// helper function declaration
// =============================================================================
var addToUniqueList = function(list, object) {
	var found = false;

	for(var i = 0; i < list.length; i++) {
		if(list[i] === object) {
			found = true;
		}
	}

	if(!found) {
		list.push(object);
	}

	return list;
};

var calcMinutesInTime = function(time) {
	var timeInMinutes = 0;

	if(time) {
		var time_hourPart = time.split(':')[0];
		var time_minutePart = time.split(':')[1];
		
		timeInMinutes = (parseInt(time_hourPart) * 60) + parseInt(time_minutePart);
	}

	return timeInMinutes;
};

var addHour = function(a, b) {
	var a_inMinute = calcMinutesInTime(a);
	var b_inMinute = calcMinutesInTime(b);
	var a_and_b_inMinute = a_inMinute + b_inMinute;
	var a_and_b_inString = a_and_b_inMinute.toString();
	var a_and_b_hourPart = parseInt(a_and_b_inMinute / 60);
	var a_and_b_minutePart = (a_and_b_inMinute - (a_and_b_hourPart * 60));
	a_and_b_inString = a_and_b_hourPart + ':' + a_and_b_minutePart;

	return a_and_b_inString;
};

var generateHtml = function(res, template, data) {
	jsrender.loadString('#timesheetTemplate', template);
	var result = jsrender.render['#timesheetTemplate'](data);

	res.send(result);
};

var readTemplate = function(cache, successCallback, errCallback) {
	if(reportTemplateContent === null) {
		fs.readFile(reportTemplateLocation, {encoding: 'utf-8'}, function (err, data) {
			if(err) {
				errCallback(err);
			} else {
				if(cache) reportTemplateContent = data;
				successCallback(data);
			}
		});
	} else {
		successCallback(reportTemplateContent);
	}
};

var retrieveTimesheetList = function(userId, startDate, endDate, successCallback, errCallback) {
	Timesheet.find({
		user: userId,
		tanggal_asDate: {'$gte': startDate, '$lte': endDate}
	}).populate('placement')
	.sort('tanggal_asDate')
	.exec(function(err, timesheetList) {
		if(err) {
			errCallback(err);
		} else {
			Client.populate(timesheetList, {
				path: 'placement.client'
			}, function() {
				successCallback(timesheetList);
			});
		}
	});
};

var retrieveUser = function(userId, successCallback, errCallback) {
	User.findOne({_id: userId}).select('name nip').exec(function(err, user) {
		if(err) {
			errCallback(err);
		} else {
			successCallback(user);
		}
	});
};

var constructRequiredData = function(user, startDate, endDate, timesheetList, namaPemeriksa, namaPenyetuju, callback) {
	// clientNames
	var clientNames = [];
	for(var i = 0; i < timesheetList.length; i++) {
		if(timesheetList[i].placement && timesheetList[i].placement.client && timesheetList[i].placement.client.name) {
			clientNames = addToUniqueList(clientNames, timesheetList[i].placement.client.name);
		}
	}

	// locationNames
	var locationNames = [];
	for(var j = 0; j < timesheetList.length; j++) {
		if(timesheetList[j].placement && timesheetList[j].placement.location) {
			locationNames = addToUniqueList(locationNames, timesheetList[j].placement.location);
		}
	}

	// calc total hour
	var jamKerjaTotal = '0:0';
	var jamOTTotal = '0:0';
	var jamTotal = '0.0';
	var totalCuti = 0;
	var totalSakit = 0;
	var totalMasuk = 0;
	var totalLibur = 0;
	var totalAlfa = 0;
	var totalHariKerja = 0;
	var persentaseKehadiran = 0;
	var totalHariKerja_jamKerja = 0;
	var persentaseJamKehadiran = 0;

	for(var k = 0; k < timesheetList.length; k++) {
		jamKerjaTotal = addHour(jamKerjaTotal, timesheetList[k].jamKerjaTotal);
		jamOTTotal = addHour(jamOTTotal, timesheetList[k].jamOTTotal);

		if(timesheetList[k].statusAbsensi === 'Masuk') {
			totalMasuk++;
			totalHariKerja++;
		} else if(timesheetList[k].statusAbsensi === 'Cuti') {
			totalCuti++;
			totalHariKerja++;
		} else if(timesheetList[k].statusAbsensi === 'Libur') {
			totalLibur++;
		} else if(timesheetList[k].statusAbsensi === 'Sakit') {
			totalSakit++;
			totalHariKerja++;
		} else if(timesheetList[k].statusAbsensi === 'Alfa') {
			totalAlfa++;
			totalHariKerja++;
		} else {
			totalHariKerja++;
		}
	}

	jamTotal = addHour(jamKerjaTotal, jamOTTotal);
	persentaseKehadiran = (totalMasuk / totalHariKerja * 100).toString().substring(0, 4) + '%';
	totalHariKerja_jamKerja = (totalHariKerja * 8);
	persentaseJamKehadiran = (calcMinutesInTime(jamTotal) / (totalHariKerja_jamKerja * 60) * 100).toString().substring(0, 4) + '%';

	// currentDate
	var currentDate = new Date();

	// construct data
	var data = {
		clientNames: clientNames,
		locationNames: locationNames,
		resourceName: user.name,
		resourceNip: user.nip,
		currentDate: (currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate()),
		startDate: (startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate()),
		endDate: (endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate()),
		jamKerjaTotal: jamKerjaTotal,
		jamOTTotal: jamOTTotal,
		jamTotal: jamTotal,
		timesheetList: timesheetList,
		namaPemeriksa: namaPemeriksa,
		namaPenyetuju: namaPenyetuju,
		totalHariKerja: totalHariKerja,
		totalLibur: totalLibur,
		totalSakit: totalSakit,
		totalCuti: totalCuti,
		totalMasuk: totalMasuk,
		totalAlfa: totalAlfa,
		persentaseKehadiran: persentaseKehadiran,
		totalHariKerja_jamKerja: totalHariKerja_jamKerja,
		persentaseJamKehadiran: persentaseJamKehadiran
	};

	callback(data);
};

var doFunction = function(res, userId, startDate, endDate, namaPemeriksa, namaPenyetuju) {
	readTemplate(false, function(reportTemplate) {
		retrieveTimesheetList(userId, startDate, endDate, function(timesheetList) {
			retrieveUser(userId, function(user) {
				constructRequiredData(user, startDate, endDate, timesheetList, namaPemeriksa, namaPenyetuju, function(data) {
					generateHtml(res, reportTemplate, data);
				});
			}, function(err) {
				return res.send(400, {message: 'Something error'});				
			});
		}, function(err) {
			return res.send(400, {message: 'Something error'});			
		});
	}, function(err) {
		return res.send(400, {message: 'Something error'});
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
module.exports = {
	do: doFunction
};
