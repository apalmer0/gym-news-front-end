'use strict';

// use require with a reference to bundle the file and use it in this file
let pageSetup = require('./page-setup');
let globalVariables = require('./global-variables');

// use require without a reference to ensure a file is bundled
require('./event-handlers');
require('./climbs');

// load sass manifest
require('../styles/index.scss');


$(document).ready(() => {

  // hides all page elements that need to appear at specific points.
  pageSetup.hidePageElements();

  // make sure the appropriate page elements are displayed
  // based on whether or not you're logged in
  if (!globalVariables.user) {
    pageSetup.toggleLoggedOut();
  } else {
    pageSetup.toggleLoggedIn();
  }

});
