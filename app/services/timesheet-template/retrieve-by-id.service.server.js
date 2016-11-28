'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	TimesheetTemplate = mongoose.model('TimesheetTemplate');

// =============================================================================
// helper function declaration
// =============================================================================

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	var timesheetTemplateId = req.param('timesheetTemplateId');

	TimesheetTemplate.findOne({_id: timesheetTemplateId})
					 .exec(function(err, timesheetTemplate) {
						if (err) {
							return res.send(400, {message: 'Something error'});
						} else {
							res.jsonp(timesheetTemplate);
						}
					 });
};
