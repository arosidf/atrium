'use strict';

// =============================================================================
// var declaration
// =============================================================================
var _ = require('lodash');

// =============================================================================
// helper function declaration
// =============================================================================

// =============================================================================
// exported function declaration
// =============================================================================
var requiresRole = function(role, req, res, next) {
	if(req.isAuthenticated()) {
		if(_.indexOf(req.user.roles, role) !== -1) {
			next();
		} else {
			return res.send(403, {message: 'User is not authorized'});	
		}
	} else {
		return res.send(401, {message: 'User is not logged in'});	
	}
};

exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.send(401, {message: 'User is not logged in'});
	}

	next();
};

exports.requiresAdminRole = function(req, res, next) {
	requiresRole('admin', req, res, next);
};

exports.requiresResourceRole = function(req, res, next) {
	requiresRole('resource', req, res, next);
};

exports.requiresEroRole = function(req, res, next) {
	requiresRole('ero', req, res, next);
};

exports.requiresNotLogged = function(req, res, next) {
	if (req.isAuthenticated()) {
		return res.send(403, {message: 'User is logged in'});
	}

	next();
};

exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.send(403, {message: 'User is not authorized'});
			}
		});
	};
};
