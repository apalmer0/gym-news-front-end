'use strict';

// let domEvents = require('./page-setup');
let pageSetup = require('./page-setup');
let pageChanges = require('./page-changes');
let globalVariables = require('./global-variables');
let ajax = require('./ajax');

let signIn = function signIn (event) {
  console.log('signing in');
  event.preventDefault();
  $('.signin-buttons').prop('disabled', true);
  var formData = new FormData(event.target);
  $.ajax({
    url: globalVariables.baseUrl + '/sign-in',
    method: 'POST',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function (userData) {
    $('.signin-buttons').prop('disabled', false);
    console.log('userData:');
    console.log(userData);

    // for heroku:
    globalVariables.user = userData.user;

    // for localhost:
    // globalVariables.user = userData;

    console.log('global variables:');
    console.log(globalVariables);
    pageSetup.toggleLoggedIn();
    pageChanges.hideModal();
    $('.homepage').show();
    pageChanges.displayMessage('.welcome');
    ajax.setGyms(event);
  }).fail(function (jqxhr) {
    $('.wrong-password').show();
    console.error(jqxhr);
  });
};

let signUp = function signUp(event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  console.log('starting signup');
  $.ajax({
    url: globalVariables.baseUrl + '/sign-up',
    method: 'POST',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function () {
    console.log('signup success');
    console.log('starting signin');
    signIn(event);
  }).fail(function (jqxhr) {
    console.error(jqxhr);
    pageChanges.hideModal();
    pageChanges.displayMessage('.message-account-exists');
  });
};

// vv sign out actions vv
let signOut = function signOut (event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  $.ajax({
    url: globalVariables.baseUrl + '/sign-out/' + globalVariables.user.id,
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    method: 'DELETE',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function (data) {
    console.log(data);
    pageSetup.toggleLoggedOut();
    pageChanges.hideModal();
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

// ^^ sign out actions ^^

// vv change password actions vv
let changePassword = function changePassword (event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  $.ajax({
    url: globalVariables.baseUrl + '/change-password/' + globalVariables.user.id,
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    method: 'PATCH',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function (data) {
    console.log(data);
    $('.password-field').val('');
    pageChanges.hideModal();
    pageChanges.displayMessage('.password');
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

// ^^ change password actions ^^

module.exports = {
  signUp,
  signIn,
  signOut,
  changePassword
};
