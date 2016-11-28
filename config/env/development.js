'use strict';

module.exports = {
	db: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost:27017/atrium',
	// db: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://admin:bBkJBDa3Ac4U@localhost:36221/atrium',
	app: {
		title: 'Atrium Xsis'
	}
};