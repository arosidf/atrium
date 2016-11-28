'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PlacementSchema = new Schema({
	prfNumber: {
		type: String
	},
	// Administratif (based on PO/Quotation/SOW/SOC)
	fromDate_asString: {
		type: String
	},
	// Administratif (based on PO/Quotation/SOW/SOC)
	toDate_asString: {
		type: String
	},
	// Real Placement Date (onboard)
	fromDateReal_asString: {
		type: String
	},
	timesheetCollectingDate: {
		type: Number
	},
	client: {
		type: Schema.ObjectId,
		ref: 'Client'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	placementType: {
		type: [{
			type: String,
			enum: ['new', 'extend', 'replace', 'pay absence']
		}]
	},
	rumpunTechnology: {
		type: [{
			type: String,
			enum: ['Java', '.NET', 'PHP', 'Other Developer', 'System Engineer', 'Other']
		}]	
	},
	location: {
		type: String
	},
	notes: {
		type: String
	},
});

mongoose.model('Placement', PlacementSchema);
