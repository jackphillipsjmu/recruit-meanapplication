'use strict';

//Customers service used to communicate Customers REST endpoints

angular.module('customers')
	.factory('Customers', ['$resource',
		function($resource) {
			return $resource('customers/:customerId', { customerId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			});
		}
	])
	.factory('Notify', ['$rootScope', function($rootScope) {
		var notify = {};

		notify.sendMsg = function(msg, data) {
			// either assign data being passed or blank obj
			data = data || {};
			$rootScope.$emit(msg, data);

			console.log('message send!');
		};

		notify.getMsg = function(msg, func, scope) {
			var unbind = $rootScope.$on(msg, func);

			// if there is something passed through
			if (scope) {
				// clean it up
				scope.$on('destroy', unbind);
			}
		};
		return notify;
		}
	]);
