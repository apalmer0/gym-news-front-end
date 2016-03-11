'use strict';

// let domEvents = require('./page-setup');
let pageSetup = require('./page-setup');
let pageChanges = require('./page-changes');
let globalVariables = require('./global-variables');
let ajax = require('./ajax');

let signIn = function signIn (event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  $.ajax({
    url: globalVariables.myApp.baseUrl + '/sign-in',
    method: 'POST',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function (user) {
    localStorage.setItem('User', JSON.stringify(user));
    globalVariables.myApp.user = user;
    pageSetup.toggleLoggedIn();
    pageChanges.hideModal();
    $('.site-content').hide();
    $('.homepage').show();
    pageChanges.displayMessage('.welcome');
    ajax.setGyms();
    ajax.showNewsfeed(event);
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
    url: globalVariables.myApp.baseUrl + '/sign-up',
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
    url: globalVariables.myApp.baseUrl + '/sign-out/' + globalVariables.myApp.user.id,
    headers: {
      Authorization: 'Token token=' + globalVariables.myApp.user.token,
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
    url: globalVariables.myApp.baseUrl + '/change-password/' + globalVariables.myApp.user.id,
    headers: {
      Authorization: 'Token token=' + globalVariables.myApp.user.token,
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
