'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//var filePluginLib = require('mongoose-file');
//var filePlugin = filePluginLib.filePlugin;
//var make_upload_to_model = filePluginLib.make_upload_to_model;
//var uploads_base = path.join(__dirname, "uploads");
//var uploads = path.join(uploads_base, "u");

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

//ApplicantSchema.plugin(filePlugin, {
//	name: "photo",
//	upload_to: make_upload_to_model(uploads, 'photos'),
//	relative_to: uploads_base
//});


mongoose.model('Applicant', ApplicantSchema);
