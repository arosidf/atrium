'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ClientSchema = new Schema({
	name: {
		type: String
	},
	external: {
		type: Boolean,
		default: true
	}
});

mongoose.model('Client', ClientSchema);
