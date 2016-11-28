'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	resource: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	clientName: {
		type: String
	},
	location: {
		type: String
	},
	departmentName: {
		type: String
	},
	userName: {
		type: String
	},
	projectName: {
		type: String
	},
	startProject: {
		type: String
	},
	endProject: {
		type: String
	},
	role: {
		type: String
	},
	projectPhase: {
		type: String
	},
	projectDescription: {
		type: String
	},
	projectTechnology: {
		type: String
	},
	mainTask: {
		type: String
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Project', ProjectSchema);
