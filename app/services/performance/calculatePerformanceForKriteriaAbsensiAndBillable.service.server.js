'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Performance = mongoose.model('Performance'),
	Placement = mongoose.model('Placement'),
	Timesheet = mongoose.model('Timesheet'),
	TimesheetTemplate = mongoose.model('TimesheetTemplate'),
	SystemConfig = mongoose.model('SystemConfig');

// =============================================================================
// helper function declaration (Kriteria Billable)
// =============================================================================
var isPlacementOnExternal = function(placementList, placement) {
	if(placement === undefined || placement === null || placement.client === undefined || placement.client === null) {
		return false;
	}

	var clientId = placement.client;

	for(var i = 0; i < placementList.length; i++) {
		if(placementList[i].client._id.equals(clientId)) {
			return placementList[i].client.external;
		}
	}

	return false;
};

var calculateStatusBillableFromTimesheet = function(performance, timesheetList, placementList) {
	var jumlahHariMasuk = 0;
	var jumlahHariSakit = 0;
	var jumlahHariCuti = 0;
	var jumlahHariLibur = 0;
	var jumlahHariAlfa = 0;

	for(var i = 0; i < timesheetList.length; i++) {
		if(isPlacementOnExternal(placementList, timesheetList[i].placement)) {
			if(timesheetList[i].statusAbsensi === 'Masuk') {
				jumlahHariMasuk++;
			} else if(timesheetList[i].statusAbsensi === 'Sakit') {
				jumlahHariSakit++;
			} else if(timesheetList[i].statusAbsensi === 'Cuti') {
				jumlahHariCuti++;
			} else if(timesheetList[i].statusAbsensi === 'Alfa') {
				jumlahHariAlfa++;
			}
		}

		if(timesheetList[i].statusAbsensi === 'Libur') {
			jumlahHariLibur++;
		}
	}

	performance.kriteriaBillableUtilization.jumlahHariMasuk = jumlahHariMasuk;
	performance.kriteriaBillableUtilization.jumlahHariSakit = jumlahHariSakit;
	performance.kriteriaBillableUtilization.jumlahHariCuti = jumlahHariCuti;
	performance.kriteriaBillableUtilization.jumlahHariLibur = jumlahHariLibur;
	performance.kriteriaBillableUtilization.jumlahHariAlfa = jumlahHariAlfa;

	performance.kriteriaBillableUtilization.kriteriaValue = ((jumlahHariMasuk + jumlahHariCuti) / performance.totalWorkingDays);
};

// =============================================================================
// helper function declaration (Kriteria Absensi)
// =============================================================================
var calculateStatusAbsensiFromTimesheet = function(performance, timesheetList) {
	var jumlahHariMasuk = 0;
	var jumlahHariSakit = 0;
	var jumlahHariCuti = 0;
	var jumlahHariLibur = 0;
	var jumlahHariAlfa = 0;

	for(var i = 0; i < timesheetList.length; i++) {
		if(timesheetList[i].statusAbsensi === 'Masuk') {
			jumlahHariMasuk++;
		} else if(timesheetList[i].statusAbsensi === 'Sakit') {
			jumlahHariSakit++;
		} else if(timesheetList[i].statusAbsensi === 'Cuti') {
			jumlahHariCuti++;
		} else if(timesheetList[i].statusAbsensi === 'Libur') {
			jumlahHariLibur++;
		} else if(timesheetList[i].statusAbsensi === 'Alfa') {
			jumlahHariAlfa++;
		}
	}

	performance.kriteriaAbsensi.jumlahHariMasuk = jumlahHariMasuk;
	performance.kriteriaAbsensi.jumlahHariSakit = jumlahHariSakit;
	performance.kriteriaAbsensi.jumlahHariCuti = jumlahHariCuti;
	performance.kriteriaAbsensi.jumlahHariLibur = jumlahHariLibur;
	performance.kriteriaAbsensi.jumlahHariAlfa = jumlahHariAlfa;

	performance.kriteriaAbsensi.kriteriaValue = ((jumlahHariMasuk + jumlahHariCuti) / performance.totalWorkingDays);
};

var findPlacement = function(performance, resource, year, month, timesheetList) {
	Placement.find({user: resource}).populate('client').exec(function(err, placementList) {
		if(!err) {
			calculateStatusAbsensiFromTimesheet(performance, timesheetList);
			calculateStatusBillableFromTimesheet(performance, timesheetList, placementList);

			performance.save();
		}
	});
};

var findTimesheet = function(performance, resource, year, month) {
	Timesheet.find({user: resource, year: year, month: month}).populate('placement').exec(function(err, timesheetList) {
		if(!err && timesheetList !== undefined && timesheetList !== null) {
			findPlacement(performance, resource, year, month, timesheetList);
		}
	});
};

var findOrCreatePerformance = function(resource, year, month, pengali, totalWorkingDays) {
	Performance.findOne({resource: resource, year: year, month: month}).exec(function(err, performance) {
		if(!err) {
			if(performance === undefined || performance === null) {
				performance = new Performance({
					resource: resource, 
					year: year, 
					month: month, 
					totalWorkingDays: totalWorkingDays,
					rumusAkhir: pengali
				});
			}
		
			findTimesheet(performance, resource, year, month);
		}
	});
};

var findTimesheetTemplateByYear = function(resource, year, month, pengali) {
	TimesheetTemplate.findOne({year: year}).exec(function(err, timesheetTemplate) {
		if(!err && timesheetTemplate !== null) {
			var totalWorkingDays = timesheetTemplate.totalWorkingDays;

			findOrCreatePerformance(resource, year, month, pengali, totalWorkingDays);
		}
	});
};

var findSystemConfigPengaliPerformance = function(resource, year, month) {
	SystemConfig.findOne({key: SystemConfig.PENGALI_PERFORMANCE}, function(err, systemConfig) {
		if(!err) {
			var pengali = systemConfig.value;

			findTimesheetTemplateByYear(resource, year, month, pengali);
		}
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
module.exports = {
	doCalculation: findSystemConfigPengaliPerformance
};
