'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 0));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	name: {
		type: String
	},
	nip: {
		type: String
	},
	joinDate_asString: {
		type: String
	},
	statusKepegawaian: {
		type: [{
			type: String,
			enum: ['active', 'resign']
		}],
		default: ['active']
	},
	lastPlacement: {
		type: Schema.ObjectId,
		ref: 'Placement'
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['resource', 'ero', 'admin']
		}],
		default: ['resource']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if(this.updatePassword !== undefined && this.updatePassword === true) {
		if (this.password && this.password.length > 5) {
			this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
			this.password = this.hashPassword(this.password);
		}
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return (this.statusKepegawaian[0] === 'active' && this.password === this.hashPassword(password));
};

mongoose.model('User', UserSchema);
