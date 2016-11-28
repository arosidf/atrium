'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	Client = mongoose.model('Client');

// =============================================================================
// helper function declaration
// =============================================================================

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	var client = new Client(req.body);

	client.save(function(err) {
		if(err) {
			return res.send(400, {message: 'Something error'});
		} else {
			res.jsonp(client);
		}
	});
};
