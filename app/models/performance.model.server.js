'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Performance Schema
 */
var PerformanceSchema = new Schema({
	// Start from 1
	year: {
		type: Number
	},
	// Start from 0. January is 0
	month: {
		type: Number
	},
	// total working days in a year. Not in a month
	totalWorkingDays: {
		type: Number
	},
	kriteriaPenilaianUser: {
		ski: Number,
		kompetensiPendukung: Number,
		kedisiplinan: Number,
		kriteriaValue: Number
	}, 
	kriteriaTimesheetCollection: {
		collectionDate_asString: String,
		perform: Boolean,
		kriteriaValue: Number
	},
	kriteriaAbsensi: {
		jumlahHariMasuk: Number,
		jumlahHariSakit: Number,
		jumlahHariCuti: Number,
		jumlahHariLibur: Number,
		jumlahHariAlfa: Number,
		kriteriaValue: Number
	},
	kriteriaBillableUtilization: {
		jumlahHariMasuk: Number,
		jumlahHariSakit: Number,
		jumlahHariCuti: Number,
		jumlahHariLibur: Number,
		jumlahHariAlfa: Number,
		kriteriaValue: Number
	},
	rumusAkhir: {
		pengaliPenilaianUser: Number,
		pengaliTimesheetCollection: Number,
		pengaliAbsensi: Number,
		pengaliBillableUtilization: Number
	},
	totalValue: {
		type: Number
	},
	resource: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

PerformanceSchema.methods.normalizeEveryKriteriaValue = function() {
	// 100% / 12 month = 0.08333
	var maxKriteriaValue = 0.08333;

	if(this.kriteriaAbsensi && this.kriteriaAbsensi.kriteriaValue > maxKriteriaValue) {
		this.kriteriaAbsensi.kriteriaValue = maxKriteriaValue;
	}
	if(this.kriteriaPenilaianUser && this.kriteriaPenilaianUser.kriteriaValue > maxKriteriaValue) {
		this.kriteriaPenilaianUser.kriteriaValue = maxKriteriaValue;
	}
	if(this.kriteriaTimesheetCollection && this.kriteriaTimesheetCollection.kriteriaValue > maxKriteriaValue) {
		this.kriteriaTimesheetCollection.kriteriaValue = maxKriteriaValue;
	}
	if(this.kriteriaBillableUtilization && this.kriteriaBillableUtilization.kriteriaValue > maxKriteriaValue) {
		this.kriteriaBillableUtilization.kriteriaValue = maxKriteriaValue;
	}
};

PerformanceSchema.methods.calculateTotalValue = function() {
	var penilaianUser = 0;
	var timesheetCollection = 0;
	var absensi = 0;
	var billable = 0;

	var pengaliPenilaianUser = 0;
	var pengaliTimesheetCollection = 0;
	var pengaliAbsensi = 0;
	var pengaliBillableUtilization = 0;

	if(this.kriteriaPenilaianUser && this.kriteriaPenilaianUser.kriteriaValue) {
		penilaianUser = this.kriteriaPenilaianUser.kriteriaValue;
	}
	if(this.kriteriaTimesheetCollection && this.kriteriaTimesheetCollection.kriteriaValue) {
		timesheetCollection = this.kriteriaTimesheetCollection.kriteriaValue;
	}
	if(this.kriteriaAbsensi && this.kriteriaAbsensi.kriteriaValue) {
		absensi = this.kriteriaAbsensi.kriteriaValue;
	}
	if(this.kriteriaBillableUtilization && this.kriteriaBillableUtilization.kriteriaValue) {
		billable = this.kriteriaBillableUtilization.kriteriaValue;
	}

	if(this.rumusAkhir && this.rumusAkhir.pengaliPenilaianUser) {
		pengaliPenilaianUser = this.rumusAkhir.pengaliPenilaianUser;
	}
	if(this.rumusAkhir && this.rumusAkhir.pengaliTimesheetCollection) {
		pengaliTimesheetCollection = this.rumusAkhir.pengaliTimesheetCollection;
	}
	if(this.rumusAkhir && this.rumusAkhir.pengaliAbsensi) {
		pengaliAbsensi = this.rumusAkhir.pengaliAbsensi;
	}
	if(this.rumusAkhir && this.rumusAkhir.pengaliBillableUtilization) {
		pengaliBillableUtilization = this.rumusAkhir.pengaliBillableUtilization;
	}

	// this.totalValue = ((billable * 0.7) + (absensi * 0.05) + (timesheetCollection * 0.15) + (penilaianUser * 0.1));
	this.totalValue = ((billable * pengaliBillableUtilization) + (absensi * pengaliAbsensi) + (timesheetCollection * pengaliTimesheetCollection) + (penilaianUser * pengaliPenilaianUser));
};

PerformanceSchema.pre('save', function(next) {
	this.normalizeEveryKriteriaValue();
	this.calculateTotalValue();

	next();
});

mongoose.model('Performance', PerformanceSchema);
