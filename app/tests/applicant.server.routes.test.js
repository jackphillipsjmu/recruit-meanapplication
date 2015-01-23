'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Applicant = mongoose.model('Applicant'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, applicant;

/**
 * Applicant routes tests
 */
describe('Applicant CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Applicant
		user.save(function() {
			applicant = {
				name: 'Applicant Name'
			};

			done();
		});
	});

	it('should be able to save Applicant instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Applicant
				agent.post('/applicants')
					.send(applicant)
					.expect(200)
					.end(function(applicantSaveErr, applicantSaveRes) {
						// Handle Applicant save error
						if (applicantSaveErr) done(applicantSaveErr);

						// Get a list of Applicants
						agent.get('/applicants')
							.end(function(applicantsGetErr, applicantsGetRes) {
								// Handle Applicant save error
								if (applicantsGetErr) done(applicantsGetErr);

								// Get Applicants list
								var applicants = applicantsGetRes.body;

								// Set assertions
								(applicants[0].user._id).should.equal(userId);
								(applicants[0].name).should.match('Applicant Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Applicant instance if not logged in', function(done) {
		agent.post('/applicants')
			.send(applicant)
			.expect(401)
			.end(function(applicantSaveErr, applicantSaveRes) {
				// Call the assertion callback
				done(applicantSaveErr);
			});
	});

	it('should not be able to save Applicant instance if no name is provided', function(done) {
		// Invalidate name field
		applicant.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Applicant
				agent.post('/applicants')
					.send(applicant)
					.expect(400)
					.end(function(applicantSaveErr, applicantSaveRes) {
						// Set message assertion
						(applicantSaveRes.body.message).should.match('Please fill Applicant name');
						
						// Handle Applicant save error
						done(applicantSaveErr);
					});
			});
	});

	it('should be able to update Applicant instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Applicant
				agent.post('/applicants')
					.send(applicant)
					.expect(200)
					.end(function(applicantSaveErr, applicantSaveRes) {
						// Handle Applicant save error
						if (applicantSaveErr) done(applicantSaveErr);

						// Update Applicant name
						applicant.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Applicant
						agent.put('/applicants/' + applicantSaveRes.body._id)
							.send(applicant)
							.expect(200)
							.end(function(applicantUpdateErr, applicantUpdateRes) {
								// Handle Applicant update error
								if (applicantUpdateErr) done(applicantUpdateErr);

								// Set assertions
								(applicantUpdateRes.body._id).should.equal(applicantSaveRes.body._id);
								(applicantUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Applicants if not signed in', function(done) {
		// Create new Applicant model instance
		var applicantObj = new Applicant(applicant);

		// Save the Applicant
		applicantObj.save(function() {
			// Request Applicants
			request(app).get('/applicants')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Applicant if not signed in', function(done) {
		// Create new Applicant model instance
		var applicantObj = new Applicant(applicant);

		// Save the Applicant
		applicantObj.save(function() {
			request(app).get('/applicants/' + applicantObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', applicant.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Applicant instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Applicant
				agent.post('/applicants')
					.send(applicant)
					.expect(200)
					.end(function(applicantSaveErr, applicantSaveRes) {
						// Handle Applicant save error
						if (applicantSaveErr) done(applicantSaveErr);

						// Delete existing Applicant
						agent.delete('/applicants/' + applicantSaveRes.body._id)
							.send(applicant)
							.expect(200)
							.end(function(applicantDeleteErr, applicantDeleteRes) {
								// Handle Applicant error error
								if (applicantDeleteErr) done(applicantDeleteErr);

								// Set assertions
								(applicantDeleteRes.body._id).should.equal(applicantSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Applicant instance if not signed in', function(done) {
		// Set Applicant user 
		applicant.user = user;

		// Create new Applicant model instance
		var applicantObj = new Applicant(applicant);

		// Save the Applicant
		applicantObj.save(function() {
			// Try deleting Applicant
			request(app).delete('/applicants/' + applicantObj._id)
			.expect(401)
			.end(function(applicantDeleteErr, applicantDeleteRes) {
				// Set message assertion
				(applicantDeleteRes.body.message).should.match('User is not logged in');

				// Handle Applicant error error
				done(applicantDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Applicant.remove().exec();
		done();
	});
});