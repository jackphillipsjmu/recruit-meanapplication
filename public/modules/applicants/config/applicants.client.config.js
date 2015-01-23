'use strict';

// Configuring the Articles module
angular.module('applicants').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Applicants', 'applicants', 'dropdown', '/applicants(/create)?');
		Menus.addSubMenuItem('topbar', 'applicants', 'List Applicants', 'applicants');
		Menus.addSubMenuItem('topbar', 'applicants', 'New Applicant', 'applicants/create');
	}
]);