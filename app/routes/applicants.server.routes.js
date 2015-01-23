'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var applicants = require('../../app/controllers/applicants.server.controller');

	// Applicants Routes
	app.route('/applicants')
		.get(applicants.list)
		.post(users.requiresLogin, applicants.create);

	app.route('/applicants/:applicantId')
		.get(applicants.read)
		.put(users.requiresLogin, applicants.hasAuthorization, applicants.update)
		.delete(users.requiresLogin, applicants.hasAuthorization, applicants.delete);

	// Finish by binding the Applicant middleware
	app.param('applicantId', applicants.applicantByID);
};
