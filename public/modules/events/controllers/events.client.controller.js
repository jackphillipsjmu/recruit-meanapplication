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

		// Modal view of the selected Event
		this.modalView = function(size, selectedEvent) {
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

eventsApp.factory('AddressGeocoder', ['$q', function($q) {
	var myGeo;

	var result = function() {
		return {
			success: false,
			message: '',
			location: {
				latitude: '',
				longitude: ''
			}
		}
	};

	myGeo = {
		getLocation:function( address ){
			var deferred = $q.defer();

			var googleMap = new google.maps.Geocoder();
			googleMap.geocode( { 'address': address}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					var ok = new result();
					ok.success = true;
					ok.location.latitude = results[0].geometry.location.lat();
					ok.location.longitude = results[0].geometry.location.lng();
					deferred.resolve(ok);
				} else {
					var error = new result();
					error.message = 'The geocode was not successful for the these reasons: ' + status;
					deferred.reject(error);
				}
			});
			return deferred.promise;
		}
	};
	//console.log('myGeo: ' + myGeo.location.latitude);
	return myGeo;
}]);

eventsApp.controller('MapsController', ['$scope', 'AddressGeocoder', function ($scope, AddressGeocoder) {

	// Default address
	$scope.address;

	// Default map code
	$scope.map = {
		center: {
			latitude: 0,
			longitude: 0
		},
		zoom: 17
	};

	$scope.findAddress = function (eventAddr) {
		console.log('FIND ADDR: ' + eventAddr);
		AddressGeocoder.getLocation(eventAddr).then(function (result) {

			if (result.success) {
				console.log('WE GOOD SAHN');
				$scope.map.center = result.location;

				console.log('LOCATION LAT/LNG: ' + result.location.latitude + '/' + result.location.latitude);
			}

		});
	};

}]);

eventsApp.directive('myMap', function() {
	// directive link function
	var link = function(scope, element, attrs) {
		var map, infoWindow;
		var markers = [];

		// map config
		var mapOptions = {
			center: new google.maps.LatLng(50, 2),
			zoom: 4,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false
		};

		// init the map
		function initMap() {
			if (map === void 0) {
				map = new google.maps.Map(element[0], mapOptions);
			}
		}

		// place a marker
		function setMarker(map, position, title, content) {
			var marker;
			var markerOptions = {
				position: position,
				map: map,
				title: title,
				icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
			};

			marker = new google.maps.Marker(markerOptions);
			markers.push(marker); // add marker to array

			google.maps.event.addListener(marker, 'click', function () {
				// close window if not undefined
				if (infoWindow !== void 0) {
					infoWindow.close();
				}
				// create new window
				var infoWindowOptions = {
					content: content
				};
				infoWindow = new google.maps.InfoWindow(infoWindowOptions);
				infoWindow.open(map, marker);
			});
		}

		// show the map and place some markers
		initMap();

		//setMarker(map, new google.maps.LatLng(), 'Test City', 'Test Content');
		setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
		//setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
		//setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
	};

	return {
		restrict: 'A',
		template: '<div id="gmaps"></div>',
		replace: true,
		link: link
	};
});

