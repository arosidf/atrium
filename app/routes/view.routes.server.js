'use strict';

var index = require('../../app/controllers/index.controller.server');

module.exports = function(app) {
	app.route('/').get(index.do);
};
