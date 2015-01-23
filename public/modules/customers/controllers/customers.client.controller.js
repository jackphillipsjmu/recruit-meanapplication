'use strict';

// Customers controller (started all in one controller but we break it up (divide and conquer!)

var customersApp = angular.module('customers');

customersApp.controller('CustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers',
	'$modal', '$log', 'Notify',
	function($scope, $stateParams, $location, Authentication, Customers, $modal, $log, Notify) {
		this.authentication = Authentication;

		// Find a list of Customers
		this.customers = Customers.query();

		// Create new customer in modal window
		this.modalCreate = function(size) {
			var modalInstance = $modal.open({
				templateUrl: 'modules/customers/views/create-customer.client.view.html',
				controller: function($scope, $modalInstance) {

					$scope.ok = function() {
						console.log('Creating');
						// Create new Customer object
						var customer = new Customers ({
							firstName: this.firstName,
							lastName: this.lastName,
							suburb: this.suburb,
							country: this.country,
							industry: this.industry,
							email: this.email,
							phone: this.phone,
							referred: this.referred,
							channel: this.channel,
							followup: this.followup

						});

						// Redirect after save
						customer.$save(function(response) {
							// notify the service that a new doc was made
							Notify.sendMsg('NewCustomer', {'id': response._id});

						}, function(errorResponse) {
							$scope.error = errorResponse.data.message;
						});
						$modalInstance.close();
					};

					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size
			});
			modalInstance.result.then(function(selectedItem) {
			}, function() {
				$log.info('Create Modal dismissed at: ' + new Date());
			});
		};



		// Open a modal window to update a single customer record
		this.modalUpdate = function(size, selectedCustomer) {
			var modalInstance = $modal.open({
				templateUrl: 'modules/customers/views/edit-customer.client.view.html',
				controller: function($scope, $modalInstance, customer) {
					$scope.customer = customer;

					// Save & Close option in modal window
					$scope.ok = function() {
						// Update existing Customer
						customer.$update(function() {
							// Output to console to check for successful submission
							console.log('Updating customer: ' + customer.firstName + ' ' + customer.lastName);
						}, function(errorResponse) {
							$scope.error = errorResponse.data.message;
							console.log($scope.error);
						});

						$modalInstance.close();
					};
					// Cancel button in modal window
					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size,
				resolve: {
					customer: function() {
						return selectedCustomer;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.selected = selectedItem;
			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		// Remove existing Customer
		this.remove = function(customer) {
			if ( customer ) {
				customer.$remove();

				for (var i in this.customers) {
					if (this.customers [i] === customer) {
						this.customers.splice(i, 1);
					}
				}
			} else {
				this.customer.$remove(function() {
					// $location.path('customers');
				});
			}
		};

		// Returns the total number of referred people
		this.getTotalReferrals = function() {
			var totalReferrals = 0;
			for (var i = 0; i < this.customers.length; i++) {
				if (this.customers[i].referred) {
					totalReferrals++;
				}
			}
			return totalReferrals;
		};

		// Returrns the total number of followups needed
		this.getTotalFollowups = function() {
			var totalFollowups = 0;
			for (var i = 0; i < this.customers.length; i++) {
				if (this.customers[i].followup) {
					totalFollowups++;
				}
			}
			return totalFollowups;
		};

		this.getNew24HourCustomers = function() {
			var total = 0;
			var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

			for (var i = 0; i < this.customers.length; i++) {
				if(Date.parse(this.customers[i].created) >= Date.parse(yesterday)) {
					total++;
				}
			}
			return total;
		};

	}
]);

customersApp.controller('CustomersUpdateController', ['$scope', 'Customers',
	function($scope, Customers) {
		//$scope.authentication = Authentication;

		// Update existing Customer
		this.update = function(updatedCustomer) {
			var customer = updatedCustomer;

			customer.$update(function() {
				console.log('Updating customer (updateCtrl): ' + customer.firstName + ' ' + customer.lastName);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);

customersApp.directive('customerList', ['Customers', 'Notify', function(Customers, Notify) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'modules/customers/views/customer-list-template.html',
		link: function(scope, element, attrs) {
			// When a new customer is added, update the customer list
			Notify.getMsg('NewCustomer', function(event, data) {
				scope.customersCtrl.customers = Customers.query();
			});
		}
	};
}]);
