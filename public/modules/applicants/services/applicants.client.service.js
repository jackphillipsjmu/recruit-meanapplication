'use strict';

//Applicants service used to communicate Applicants REST endpoints
angular.module('applicants').factory('Applicants', ['$resource',
	function($resource) {
		return $resource('applicants/:applicantId', { applicantId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);