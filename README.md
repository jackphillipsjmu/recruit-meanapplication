MEAN Application written to help my understanding of AngularJS using boilerplate code provided by MEAN.JS.

[ Development Log ]

- 1/27/15:
	- Google Maps Geocoding factory is up and working in test environment
		- Added to Events list page
	- Applicants modal routing fixed
	- Applicants remove now refreshes window using $state.reload()
	- Map markers for Events working
	- Removing Events routing properly (closing modal, going back to list)
- 1/26/15:
	- Modal window for viewing Applicant working (had to rewrite function due to improper injection)
	- Work beginning on modal edit for applicants
	- Applicants modal window routing fixed for edit (remove still needs work)
	- Routing needs work on a few more components.
- 1/23/15:
	- Modal window for viewing events working (has edit option which routes you to the edit event page)
1/22/15:
	- Got phone numbers working for applicants/events so on mobile it will launch automatically
	- Home page work:
		- Accordions corresponding subject matters functioning (names link with their profile)
	- Modal window on home page for customers set up
- 1/21/15:
	- New applicants option added in webapp
	- CRUD operations on applicants completed
	- UI for applicants in development
		- Accordion bootstrap for applicant information complete
		- Needs work if it will be a modal window
	- Research into uploading documents using the MongoDB
	- Routes to Google maps for applicant addresses working
- 1/20/15:
	- UI updates for different event screens
	- Added google maps links to locations
	- Time picker functional
	- Modified events schema in MongoDB (added start time and end time)
	- Search for events functional
	- Home page events linked up (changed local $scope to 'this' in Events controller)
	- Applicants section started
	- Document explorer/ingestion
- 1/19/15:
	- Finished up Customers section of Web application
	- Development for Event section beggining
		- Date picker and other UI dependencies complete
		- Time picker still needs to be developed
		- MongoDB events collection added 
- 1/16/15:
	- Create new customer functional
	- Remove customer functional
	- Update customer functional
	- Directive added for cleaner code in controller
	- Referred dependencies in customer lists functioning normally
- 1/15/15:
	- Customer list controller modified
	- CRUD operations added to MEAN application (not functioning)
	- UI modal windows for updating a customer in application working







