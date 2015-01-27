'use strict';

var applicantsApp = angular.module('applicants');

// Applicants controller
applicantsApp.controller('ApplicantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Applicants',
	'$modal', '$log', 'NotifyApplicant', '$state',
	function($scope, $stateParams, $location, Authentication, Applicants, $modal, $log, NotifyApplicant, $state) {
		this.authentication = Authentication;

		this.applicants = Applicants.query();

		// Create new Applicant
		$scope.create = function() {
			console.log('Creating Applicant');
			// Create new Applicant object
			var applicant = new Applicants ({
				firstName: this.firstName,
				lastName: this.lastName,
				address: this.address,
				phone: this.phone,
				email: this.email,
				school: this.school,
				position: this.position,
				degree: this.degree,
				experience: this.experience,
				skills: this.skills,
				referred: this.referred,
				followup: this.followup,
				graduation: Date.parse(this.graduation),
				graduated: this.graduated,
				notes: this.notes
			});

			// Redirect after save
			applicant.$save(function(response) {
				// reroute to our applicants list
				$location.path('applicants');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Applicant
		$scope.remove = function(applicant) {
			if ( applicant ) { 
				applicant.$remove();
				console.log('first remove');

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
			console.log('after else');
			//$location.path('applicants');
			$state.reload();
		};



		// Update existing Applicant
		$scope.update = function() {
			var applicant = $scope.applicant;

			applicant.$update(function() {
				//$location.path('applicants/' + applicant._id);
				$location.path('applicants');
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

		// Brings up a modal window of the Applicant for the user to view
		this.modalApplicantView = function(size, selectedApplicant) {
			var modalInstance = $modal.open({
				templateUrl: '/modules/applicants/views/view-applicant.client.view.html',
				controller: function($scope, $modalInstance, applicant) {
					$scope.applicant = applicant;

					$scope.removeApplicant = function(applicant) {
						if (applicant) {
							applicant.$remove();
							console.log('Removed');
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
						console.log('modal closing');
						$modalInstance.close();
					};

					$scope.ok = function() {
						$modalInstance.close();
					};
					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size,
				resolve: {
					applicant: function() {
						return selectedApplicant;
					}
				}

			});
			modalInstance.result.then(function(selectedItem) {
				$scope.selected = selectedItem;
			}, function() {
				$log.info('Modal Dismissed at: ' + new Date());
			});
		};

		this.modalApplicantUpdate = function(size, selectedApplicant) {
			var modalInstance = $modal.open({
				templateUrl: '/modules/applicants/views/edit-applicant.client.view.html',
				controller: function($scope, $modalInstance, applicant) {
					$scope.applicant = applicant;

					// Save & Close option in modal window
					$scope.ok = function() {
						// Update existing Customer
						applicant.$update(function() {
							// Output to console to check for successful submission
							console.log('Updating applicant: ' + applicant.firstName + ' ' + applicant.lastName);
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
					applicant: function() {
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

		// Returns the total number of applicants
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

/* Prompts a dialog box confirming that you want to do the associated action (ex. delete a applicant */
applicantsApp.directive('ngReallyClick', [function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				var message = attrs.ngReallyMessage;
				if (message && confirm(message)) {
					scope.$apply(attrs.ngReallyClick);
				}
			});
		}
	}
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
