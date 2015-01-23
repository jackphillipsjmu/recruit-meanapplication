'use strict';

//Setting up route
angular.module('applicants').config(['$stateProvider',
	function($stateProvider) {
		// Applicants state routing
		$stateProvider.
		state('listApplicants', {
			url: '/applicants',
			templateUrl: 'modules/applicants/views/list-applicants.client.view.html'
		}).
		state('createApplicant', {
			url: '/applicants/create',
			templateUrl: 'modules/applicants/views/create-applicant.client.view.html'
		}).
		state('viewApplicant', {
			url: '/applicants/:applicantId',
			templateUrl: 'modules/applicants/views/view-applicant.client.view.html'
		}).
		state('editApplicant', {
			url: '/applicants/:applicantId/edit',
			templateUrl: 'modules/applicants/views/edit-applicant.client.view.html'
		});
	}
]);