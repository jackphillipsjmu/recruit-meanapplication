'use strict';

var applicantsApp = angular.module('applicants');

// Applicants controller
applicantsApp.controller('ApplicantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Applicants',
	'$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Applicants, $modal, $log) {
		this.authentication = Authentication;

		this.applicants = Applicants.query();

		// Create new Applicant
		$scope.create = function() {
			console.log('Creating Applicant');
			// Create new Applicant object
			var applicant = new Applicants ({
				firstName: $scope.firstName,
				lastName: $scope.lastName,
				address: $scope.address,
				phone: $scope.phone,
				email: $scope.email,
				school: $scope.school,
				position: $scope.position,
				degree: $scope.degree,
				experience: $scope.experience,
				skills: $scope.skills,
				referred: $scope.referred,
				followup: $scope.followup,
				graduation: Date.parse($scope.graduation),
				graduated: $scope.graduated,
				notes: $scope.notes
			});

			// Redirect after save
			applicant.$save(function(response) {
				$location.path('applicants/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Applicant
		$scope.remove = function(applicant) {
			if ( applicant ) { 
				applicant.$remove();

				for (var i in $scope.applicants) {
					if ($scope.applicants [i] === applicant) {
						$scope.applicants.splice(i, 1);
					}
				}
			} else {
				$scope.applicant.$remove(function() {
					$location.path('applicants');
				});
			}
		};

		// Open a modal window to update a single customer record
		this.modalUpdate = function(size, selectedApplicant) {
			var modalInstance = $modal.open({
				templateUrl: 'modules/applicants/views/edit-applicant.client.view.html',
				controller: function($scope, $modalInstance, applicant) {
					$scope.applicant = applicant;

					// Save & Close option in modal window
					$scope.ok = function() {
						// Update existing Customer
						applicant.$update(function() {
							// Output to console to check for successful submission
							console.log('Updating customer: ' + applicant.firstName + ' ' + applicant.lastName);
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
						return selectedApplicant;
					}
				}
			});

		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		}, function() {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

		this.modalView = function(size, selectedApplicant) {
			//console.log(selectedEvent);
			var modalInstance = $modal.open({
				templateUrl: '/modules/applicants/views/view-applicant.client.view.html',
				controller: function($scope, $modalInstance, applicant) {
					$scope.applicant = applicant;

					console.log($scope.applicant.firstName);

					// Save & Close option in modal window
					$scope.ok = function() {
						$modalInstance.close();
					};
					// Cancel button in modal window
					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size,
				resolve: {
					event: function() {
						return selectedApplicant;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.selected = selectedItem;
			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		// Update existing Applicant
		$scope.update = function() {
			var applicant = $scope.applicant;

			applicant.$update(function() {
				$location.path('applicants/' + applicant._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Applicants
		$scope.find = function() {
			$scope.applicants = Applicants.query();
		};

		// Find existing Applicant
		$scope.findOne = function() {
			$scope.applicant = Applicants.get({ 
				applicantId: $stateParams.applicantId
			});
		};


		$scope.uploadFile = function() {
			var file = $scope.myFile;
			console.log('file is: ' + JSON.stringify(file));

		};

		this.getTotalApplicants = function() {
			return this.applicants.length;
		};

		// Returns the total number of referred people
		this.getTotalApplicantReferrals = function() {
			var totalReferrals = 0;
			for (var i = 0; i < this.applicants.length; i++) {
				if (this.applicants[i].referred) {
					totalReferrals++;
				}
			}
			return totalReferrals;
		};

		// Returrns the total number of followups needed
		this.getTotalApplicantFollowups = function() {
			var totalFollowups = 0;
			for (var i = 0; i < this.applicants.length; i++) {
				if (this.applicants[i].followup) {
					totalFollowups++;
				}
			}
			return totalFollowups;
		};

		// parse the created date of appliant and compare it to 24 hours before
		this.getNew24HourApplicants = function() {
			var total = 0;
			var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

			for (var i = 0; i < this.applicants.length; i++) {
				if(Date.parse(this.applicants[i].created) >= Date.parse(yesterday)) {
					total++;
				}
			}
			return total;
		};

		/* Compares the date passed in with the date param and compares it to 24 hours before
		 * returns true if the dates are greater, false otherwise
		 */
		this.getYesterdayDate = function(date) {
			var yesterday  = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
			if (Date.parse(date) >= yesterday)
				return true;
			return false;
		};



	}
]);

applicantsApp.directive('fileModel', ['$parse', function($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function() {
				scope.$apply(function() {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);

applicantsApp.service('fileUpload', ['$http', function ($http) {
	this.uploadFileToUrl = function(file, uploadUrl){
		var fd = new FormData();
		fd.append('file', file);
		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		})
			.success(function(){
				console.log('SUCCESS');
			})
			.error(function(){
				console.log('ERROR');
			});
	};
}]);
