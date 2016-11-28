'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SystemConfig = mongoose.model('SystemConfig'),
	async = require('async');

// =============================================================================
// helper function declaration
// =============================================================================
var createInitialSetupInSystemConfig = function(callback) {
	var systemConfig = new SystemConfig({
		key: SystemConfig.INITIAL_SETUP,
		value: 'true'
	});

	systemConfig.save(function(err, result) {
		if(!err) {
			callback();
		}
	});
};

var createUser = function(name, nip, email, password, roles, callback) {
	var newUser = new User({
		name: name,
		nip: nip,
		email: email,
		password: password,
		provider: 'local',
		roles: roles
	});

	newUser.save(function(err, result) {
		if(!err) {
			callback();
		}
	});

	return newUser;
};

var createPengaliPerformance = function(callback) {
	var pengaliPerformance = {
		pengaliPenilaianUser: 0.1,
		pengaliTimesheetCollection: 0.15,
		pengaliAbsensi: 0.05,
		pengaliBillableUtilization: 0.7
	};

	var pengaliPerformanceSystemConfig = new SystemConfig({
		key: SystemConfig.PENGALI_PERFORMANCE,
		value: pengaliPerformance
	});

	pengaliPerformanceSystemConfig.save(function(err, result) {
		if(!err) {
			callback();
		}
	});

	return pengaliPerformance;
};

var generateResponse = function(res, resultObject) {
	res.jsonp(resultObject);
};

var findInitialSetupInSystemConfig = function(req, res) {
	SystemConfig.findOne({key: 'initial-setup'}, function(err, systemConfig) {
		if(!systemConfig) {
			var pengaliPerformance = createPengaliPerformance(function() {
				var eroDesdriantonIslamy = createUser('Desdrianton Islamy', 'xxx', 'desdrianton.islamy@xsis.co.id', 'XsisWinners321', ['ero'], function() {
					var eroAhmadBagus = createUser('Ahmad Bagus', 'xxx', 'ahmad.bagus@xsis.co.id', 'XsisWinners321', ['ero'], function() {
						var eroApriyaniRismawanti = createUser('Apriyani Rismawanti', 'xxx', 'apriyani.rismawanti@xsis.co.id', 'XsisWinners321', ['ero'], function() {
							var eroRismawanti = createUser('Rismawanti', 'xxx', 'rismawanti@xsis.co.id', 'XsisWinners321', ['ero'], function() {
								var eroAlfianaMaulidia = createUser('Alfiana Maulidia', 'xxx', 'alfiana.maulidia@xsis.co.id', 'XsisWinners321', ['ero'], function() {
									createInitialSetupInSystemConfig(function() {
										generateResponse(res, {
											pengaliPerformance: pengaliPerformance,
											eroDesdriantonIslamy: eroDesdriantonIslamy,
											eroAhmadBagus: eroAhmadBagus,
											eroApriyaniRismawanti: eroApriyaniRismawanti,
											eroRismawanti: eroRismawanti,
											eroAlfianaMaulidia: eroAlfianaMaulidia
										});
									});
								});
							});
						});
					});
				});
			});
		} else {
			return res.send(409, {message: 'Initial setup sudah pernah dilakukan !!!'});
		}
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	findInitialSetupInSystemConfig(req, res);
};
