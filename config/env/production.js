'use strict';

module.exports = {
	db: process.env.OPENSHIFT_MONGODB_DB_URL + 'atrium' || 'mongodb://localhost/atrium-prod',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/angular-busy/angular-busy.css',
				'public/lib/ngDialog/css/ngDialog.min.css',
				'public/lib/ngDialog/css/ngDialog-theme-default.css'
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/angular-busy/angular-busy.js',
				'public/lib/ngDialog/js/ngDialog.min.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/bootstrap/js/dropdown.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js',
		cssSrc: [
			'public/modules/**/css/*.css'
		],
		jsSrc: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		]
	}
};