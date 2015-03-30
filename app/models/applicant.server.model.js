'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Applicant Schema
 */
var ApplicantSchema = new Schema({
	firstName: {
		type: String,
		default: '',
		trim: true
	},
	lastName: {
		type: String,
		default: '',
		trim: true
	},
	address: {
		type: String,
		default: '',
		trim: true
	},
	email: {
		type: String,
		default: '',
		trim: true
	},
	phone: {
		type: String,
		default: '',
		trim: true
	},
	position: {
		type: String,
		default: '',
		trim: true
	},
	school: {
		type: String,
		default: '',
		trim: true
	},
	degree: {
		type: String,
		default: '',
		trim: true
	},
	experience: {
		type: String,
		default: '',
		trim: true
	},
	skills: {
		type: String,
		default: '',
		trim: true
	},
	referred: {
		type: Boolean
	},
	followup: {
		type: Boolean
	},
	graduation: {
		type: Date
	},
	graduated: {
		type: Boolean
	},
	notes: {
		type: String,
		default: '',
		trim: true
	},

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Applicant', ApplicantSchema);
