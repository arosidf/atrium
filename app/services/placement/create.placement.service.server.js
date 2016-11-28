'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Placement = mongoose.model('Placement'),
	_ = require('lodash');

// =============================================================================
// helper function declaration
// =============================================================================
var updateLastPlacementInUser = function(req, res, placement) {
	User.findOne({_id: req.body.user}).exec(function(err, user) {
		if (err) {
			return res.send(400, {message: 'Something error'});
		} else {
			user.lastPlacement = placement;

			user.save(function (err, user) {
				if(err) {
					return res.send(400, {message: 'Something error'});
				} else {
					res.send(200);
				}		
			});
		}
	});
};

var createPlacement = function(req, res) {
	var placement = new Placement(req.body);

	placement.save(function(err, placement) {
		if(err) {
			return res.send(400, {message: 'Something error'});
		} else {
			updateLastPlacementInUser(req, res, placement);
		}
	});
};

var updatePlacement = function(req, res) {
	Placement.findById(req.body.placementId, function(err, placement) {
		if(err) {
			return res.send(400, {message: 'Something error'});
		} else {
			placement = _.extend(placement, req.body);
			placement.save(function(err) {
				if(err) {
					return res.send(400, {message: 'Something error'});
				} else {
					res.send(200);
				}
			});
		}
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	if(req.body.placementId === undefined || req.body.placementId === null) {
		createPlacement(req, res);
	} else {
		updatePlacement(req, res);
	}
};
