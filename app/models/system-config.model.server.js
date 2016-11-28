'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var SystemConfigSchema = new Schema({
	key: {
		type: String
	},
	value: {
		type: Schema.Types.Mixed
	}
});

SystemConfigSchema.statics.INITIAL_SETUP = 'initial-setup';
SystemConfigSchema.statics.PENGALI_PERFORMANCE = 'pengali-performance';

mongoose.model('SystemConfig', SystemConfigSchema);
