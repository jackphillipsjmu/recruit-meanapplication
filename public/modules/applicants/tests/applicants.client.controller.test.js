'use strict';

(function() {
	// Applicants Controller Spec
	describe('Applicants Controller Tests', function() {
		// Initialize global variables
		var ApplicantsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Applicants controller.
			ApplicantsController = $controller('ApplicantsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Applicant object fetched from XHR', inject(function(Applicants) {
			// Create sample Applicant using the Applicants service
			var sampleApplicant = new Applicants({
				name: 'New Applicant'
			});

			// Create a sample Applicants array that includes the new Applicant
			var sampleApplicants = [sampleApplicant];

			// Set GET response
			$httpBackend.expectGET('applicants').respond(sampleApplicants);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.applicants).toEqualData(sampleApplicants);
		}));

		it('$scope.findOne() should create an array with one Applicant object fetched from XHR using a applicantId URL parameter', inject(function(Applicants) {
			// Define a sample Applicant object
			var sampleApplicant = new Applicants({
				name: 'New Applicant'
			});

			// Set the URL parameter
			$stateParams.applicantId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/applicants\/([0-9a-fA-F]{24})$/).respond(sampleApplicant);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.applicant).toEqualData(sampleApplicant);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Applicants) {
			// Create a sample Applicant object
			var sampleApplicantPostData = new Applicants({
				name: 'New Applicant'
			});

			// Create a sample Applicant response
			var sampleApplicantResponse = new Applicants({
				_id: '525cf20451979dea2c000001',
				name: 'New Applicant'
			});

			// Fixture mock form input values
			scope.name = 'New Applicant';

			// Set POST response
			$httpBackend.expectPOST('applicants', sampleApplicantPostData).respond(sampleApplicantResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Applicant was created
			expect($location.path()).toBe('/applicants/' + sampleApplicantResponse._id);
		}));

		it('$scope.update() should update a valid Applicant', inject(function(Applicants) {
			// Define a sample Applicant put data
			var sampleApplicantPutData = new Applicants({
				_id: '525cf20451979dea2c000001',
				name: 'New Applicant'
			});

			// Mock Applicant in scope
			scope.applicant = sampleApplicantPutData;

			// Set PUT response
			$httpBackend.expectPUT(/applicants\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/applicants/' + sampleApplicantPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid applicantId and remove the Applicant from the scope', inject(function(Applicants) {
			// Create new Applicant object
			var sampleApplicant = new Applicants({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Applicants array and include the Applicant
			scope.applicants = [sampleApplicant];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/applicants\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleApplicant);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.applicants.length).toBe(0);
		}));
	});
}());