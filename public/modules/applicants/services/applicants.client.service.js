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
])
	.factory('NotifyApplicant', ['$rootScope', function($rootScope) {
		var notify = [];

		notify.sendMsg = function(msg, data) {
			data = data || [];
			$rootScope.$emit(msg, data);
			console.log('MESSAGE SENT');
		};
		notify.getMsg = function(msg, func, scope) {
			var unbind = $rootScope.$on(msg, func);

			if(scope) {
				scope.$on('destroy', unbind);
			}
		};
		return notify;
	}]);
