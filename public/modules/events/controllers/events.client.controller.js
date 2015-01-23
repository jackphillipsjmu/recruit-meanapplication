'use strict';

var eventsApp = angular.module('events');

// Events controller
eventsApp.controller('EventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events',
	'$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Events, $modal, $log) {
		this.authentication = Authentication;

		this.events = Events.query();

		$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

		// Used for TimePicker and start/end times of event
		$scope.start = new Date();
		$scope.end = new Date();
		$scope.hstep = 1;
		$scope.mstep = 1;

		// Create new Event
		$scope.create = function() {
			console.log('Creating event');
			// Create new Event object
			var event = new Events ({
				name: this.name,
				address: this.address,
				phone: this.phone,
				email: this.email,
				coordinator: this.coordinator,
				description: this.description,
				notes: this.notes,
				date: Date.parse(this.date),
				start: Date.parse($scope.start),
				end: Date.parse($scope.end)
			});
			console.log(event.name);
			// Redirect after save
			event.$save(function(response) {
				$location.path('events/' + event._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Event
		$scope.remove = function(event) {
			if ( event ) {
				event.$remove();

				for (var i in $scope.events) {
					if ($scope.events [i] === event) {
						$scope.events.splice(i, 1);
					}
				}
			} else {
				$scope.event.$remove(function() {
					$location.path('events');
				});
			}
		};

		// Update existing Event
		$scope.update = function() {
			var event = $scope.event;

			event.$update(function() {
				$location.path('events');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		this.modalView = function(size, selectedEvent) {
			//console.log(selectedEvent);
			var modalInstance = $modal.open({
				templateUrl: 'modules/events/views/view-event.client.view.html',
				controller: function($scope, $modalInstance, event) {
					$scope.event = event;

					console.log($scope.event.name);

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
						return selectedEvent;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.selected = selectedItem;
			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};


		// Find a list of Events
		$scope.find = function() {
			$scope.events = Events.query();
		};

		// Find existing Event
		$scope.findOne = function() {
			$scope.event = Events.get({
				eventId: $stateParams.eventId
			});
		};

		// Used in conjunction with timepicker
		$scope.ismeridian = true;
		$scope.toggleMode = function() {
			$scope.ismeridian = ! $scope.ismeridian;
		};

		$scope.updateTime = function() {
			console.log('Updating time: ' + $scope.myTime);
		};

		// Log when the time is changed
		$scope.changed = function() {
			console.log('Change Time: ' + $scope.start + '->' + $scope.end);

		};

		// Returns the total number of events
		this.getTotalEvents = function() {
			return this.events.length;
		};

		/* Controllers */
		function SearchForm($scope){
			$scope.location = '';

			$scope.doSearch = function(){
				if($scope.location === ''){
					alert('Directive did not update the location property in parent controller.');
				} else {
					alert('Yay. Location: ' + $scope.location);
				}
			};
		}

	}
]);

eventsApp.directive('googlePlaces', function(){
		return {
			restrict:'E',
			replace:true,
			// transclude:true,
			scope: {location:'='},
			template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>',
			link: function($scope, elm, attrs){
				var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
				google.maps.event.addListener(autocomplete, 'place_changed', function() {
					var place = autocomplete.getPlace();
					$scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
					$scope.$apply();
				});
			}
		};
	});

angular.module('myApplicationModule', ['uiGmapgoogle-maps']);
