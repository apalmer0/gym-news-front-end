'use strict';

var toggleLoggedIn = function toggleLoggedIn() {
  $('.logged-in').show();
  $('.logged-out').hide();
};

var toggleLoggedOut = function toggleLoggedOut() {
  $('.logged-out').show();
  $('.logged-in').hide();
};

var hidePageElements = function hidePageElements() {
  $('.message-account-exists').hide();
  $('.bulletin-created').hide();
  $('.climb-edited').hide();
  $('.climb-deleted').hide();
  $('.climb-favorited').hide();
  $('.welcome').hide();
  $('.new-climbs').hide();
  $('.password').hide();
  $('.wrong-password').hide();
  $('.new-gym').hide();
};


module.exports = {
  toggleLoggedIn,
  toggleLoggedOut,
  hidePageElements
};
