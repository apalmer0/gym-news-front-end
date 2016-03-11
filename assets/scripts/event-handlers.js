'use strict';

let authentication = require('./authentication');
let ajax = require('./ajax');
let gyms = require('./gyms');
let users = require('./users');
let climbs = require('./climbs');
let bulletins = require('./bulletins');

// miscellaneous; causes the navbar to collapse
// when you click a button in an overlaying modal
$('.modal-button').on('click', function () {
  $('.navbar-collapse').removeClass('in');
});

// signup actions
$('.sign-up').on('submit', function (event) {
  authentication.signUp(event);
});

// signin actions
$('.sign-in').on('submit', function (event) {
  authentication.signIn(event);
});

// signOut actions
$('#sign-out').on('click', function (event) {
  authentication.signOut(event);
});

// change password actions
$('#change-pw').on('submit', function (event) {
  authentication.changePassword(event);
});

// newsfeed actions
$('#homepage').on('click', function (event) {
  ajax.showNewsfeed(event);
});

// visit single gym/user actions
$('.content-body').on('click', 'button.visit-single-resource', function (event) {
  ajax.getSingleUserOrGym(event);
});

// all gyms actions
$('#all-gyms').on('click', function (event) {
  gyms.getAllGyms(event);
});

// vv add gym actions vv
$('#new-gym').on('submit', function (event) {
  gyms.createNewGym(event);
});

// all users actions
$('#all-users').on('click', function (event) {
  users.getAllUsers(event);
});

// my profile actions
$('#my-profile').on('click', function (event) {
  users.getMyProfile(event);
});

// favorite climbs
$('.content-body').on('click', 'button.favorite-climb-button', function() {
  climbs.addFavoriteClimb();
});

// add a new climb
$('#add-new-climb-form').submit(function (event) {
  climbs.addNewClimbs(event);
});

// open edit climb menu
$('.content-body').on('click', 'div.climb-square', function(event) {
  climbs.openEditClimbModal(event);
});

// edit climb
$('#edit-climb-form').on('submit', function (event) {
  climbs.submitClimbEdit(event);
});

// delete climb
$('.delete-climb-button').on('click', function (event) {
  climbs.deleteClimb(event);
});

// vvvv create the new bulletin FORM (not the actual bulletin) vvvv
$('.action-items').on('click', 'button', function() {
  bulletins.setUpNewBulletinForm();
});

// vvvv here's where we actually create the bulletin. sweet. vvvv
$('#new-bulletin-form').on('submit', function(event) {
  bulletins.createNewBulletin(event);
});

module.exports = true;
