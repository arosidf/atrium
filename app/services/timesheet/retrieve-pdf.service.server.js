'use strict';

// =============================================================================
// var declaration
// =============================================================================
var phantom = require('phantom'),
	path = require('path'),
	fs = require('fs');

// =============================================================================
// helper function declaration
// =============================================================================

// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
	var pdfLocation = path.join(atriumConfig.tempDataDir, 'timesheet.pdf');
	var phantomjsLocation = path.join(__dirname, '..', '..', '..', 'node_modules', 'phantom', 'bin', 'phantomjs', 'bin/');
	var resourceId = req.user._id;
	var url = req.protocol + '://' + req.headers.host + '/api/timesheet/' + resourceId + '/retrieve-html/' + req.param('startDate') + '/' +req.param('endDate')

	fs.exists(pdfLocation, function (exists) {
		if(exists) {
			fs.unlink(pdfLocation);
		}
	});

	var options = {
		port: 15099,
		hostname: atriumConfig.ip,
		path: phantomjsLocation
	};

	phantom.create(function(ph){
		ph.createPage(function(page) {
			page.open(url, function(status) {
				if (status !== 'success') {
					console.log('Unable to load the address!');
					ph.exit(1);
					res.send('error');
				} else {
					setTimeout(function () {
						page.set('paperSize', {
							format: 'A4',
							margin: '1cm'
						});
						page.render(pdfLocation, function() {
							ph.exit();
							res.download(pdfLocation);
						});
					}, 200);
				}
			});
		});
	}, options);
};
