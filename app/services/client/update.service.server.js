'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	Client = mongoose.model('Client'),
    _ = require('lodash');

// =============================================================================
// helper function declaration
// =============================================================================
var updateClient = function(req, res) {
	Client.findById(req.body._id, function(err, client) {
		if(err) {
			return res.send(400, {message: 'Something error'});
		} else {
			client = _.extend(client, req.body);
			client.save(function(err) {
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
	updateClient(req, res);
};
