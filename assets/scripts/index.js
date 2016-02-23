'use strict';

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// use require without a reference to ensure a file is bundled
require('./example');

// load sass manifest
require('../styles/index.scss');

const myApp = {
  baseUrl: 'http://localhost:3000',
};

$(document).ready(() => {
  // initial page setup

  var toggleLoggedIn = function toggleLoggedIn() {
    $('.login').hide();
    $('.game').show();
    $('.logged-in').show();
    $('.logged-out').hide();
  };

  var toggleLoggedOut = function toggleLoggedOut() {
    $('.login').show();
    $('.game').hide();
    $('.logged-out').show();
    $('.logged-in').hide();
  };

  var hidePageElements = function hidePageElements() {
    $('.restart').hide();
    $('.welcome').hide();
    $('.message-signout').hide();
    $('.winner-message').hide();
    $('.tie-message').hide();
    $('.password').hide();
    $('.wrong-password').hide();
    $('.message-account-exists').hide();
    $('.deathmatch-started').hide();
    $('.yo-wait').hide();
    $('.player-quit').hide();
    $('#end-multiplayer-game').hide();
    $('.opp-quit').hide();
  };

  var hideModal = function hideModal() {
    $('.modal').hide();
    $('.modal').removeClass('in');
    $('.modal').attr('style','display: none;');
    $('.modal-backdrop').hide();
  };

  var displayMessage = function displayMessage(type) {
    $(function () {
      $(type).delay(50).fadeIn('normal', function () {
        $(this).delay(2000).fadeOut();
      });
    });
  };

  // hides all page elements that need to appear at specific points.
  hidePageElements();

  // make sure the appropriate page elements are displayed
  // based on whether or not you're logged in
  if (!myApp.user) {
    toggleLoggedOut();
  } else {
    toggleLoggedIn();
  }

  // miscellaneous; causes the navbar to collapse
  // when you click a button in an overlaying modal
  $('.modal-button').on('click', function () {
    $('.navbar-collapse').removeClass('in');
  });

  // vv signup actions vv
  $('.sign-up').on('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    console.log('starting signup');
    $.ajax({
      url: myApp.baseUrl + '/sign-up',
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function () {
      console.log('signup success');
      console.log('starting signin');
      $.ajax({
        url: myApp.baseUrl + '/sign-in',
        method: 'POST',
        contentType: false,
        processData: false,
        data: formData,
      }).done(function (user) {
        console.log('signin success');
        myApp.user = user;
        console.log(user.token);
        toggleLoggedIn();
        hideModal();
        displayMessage('.welcome');
      }).fail(function (jqxhr) {
        $('.wrong-password').show();
        console.error(jqxhr);
      });
    }).fail(function (jqxhr) {
      console.error(jqxhr);
      hideModal();
      displayMessage('.message-account-exists');
    });
  });

  // ^^ signup actions ^^

  // vv signin actions vv
  $('.sign-in').on('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    $.ajax({
      url: myApp.baseUrl + '/sign-in',
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (user) {
      myApp.user = user;
      console.log(user);
      console.log(user.token);
      toggleLoggedIn();
      hideModal();
      displayMessage('.welcome');
    }).fail(function (jqxhr) {
      $('.wrong-password').show();
      console.error(jqxhr);
    });
  });

  // ^^ signin actions ^^

  // vv change password actions vv
  $('#change-pw').on('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    $.ajax({
      url: myApp.baseUrl + '/change-password/' + myApp.user.id,
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'PATCH',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (data) {
      console.log(data);
      $('.password-field').val('');
      hideModal();
      displayMessage('.password');
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ change password actions ^^

  // vv sign out actions vv
  $('#sign-out').on('submit', function (event) {
    event.preventDefault();
    if (!myApp.user) {
      console.error('Wrong!');
    }

    var formData = new FormData(event.target);
    $.ajax({
      url: myApp.baseUrl + '/sign-out/' + myApp.user.id,
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'DELETE',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (data) {
      console.log(data);
      toggleLoggedOut();
      hideModal();
      displayMessage('.message-signout');
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ sign out actions ^^

});
