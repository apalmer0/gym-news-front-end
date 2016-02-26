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
    $('.logged-in').show();
    $('.logged-out').hide();
  };

  var toggleLoggedOut = function toggleLoggedOut() {
    $('.logged-out').show();
    $('.logged-in').hide();
  };

  var hidePageElements = function hidePageElements() {
    $('.message-account-exists').hide();
    $('.welcome').hide();
    $('.password').hide();
    $('.wrong-password').hide();
    $('.new-gym').hide();
  };

  var hideModal = function hideModal() {
    $('.modal').hide();
    $('.modal').removeClass('in');
    $('.modal').attr('style','display: none;');
    $('.modal-backdrop').hide();
    $('body').removeClass('modal-open');
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

  $(".story-btn").click(function () {
    let $button = $(this);
    //getting the next element
    let $content = $button.next();
    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
    $content.slideToggle(500, function () {
        //execute this after slideToggle is done
        //change text of header based on visibility of content div
        console.log('done');
    });
    if ($(this).hasClass('glyphicon-chevron-down')) {
      $(this).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    } else {
      $(this).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    }
  });

 //  $(window).bind('scroll', function() {
 //  var navHeight = $( window ).height() - 300;
 //    if ($(window).scrollTop() > navHeight) {
 //      console.log('addClass');
 //      console.log(navHeight);
 //      $('.newsfeed-menu').addClass('fixed');
 //    }
 //    else {
 //      console.log('removeClass');
 //      console.log(navHeight);
 //      $('.newsfeed-menu').removeClass('fixed');
 //    }
 // });

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
      $('.site-content').hide();
      $('.homepage').show();
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

  // vv add gym actions vv
  $('#new-gym').on('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    $.ajax({
      url: myApp.baseUrl + '/gyms',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData
    }).done(function (data) {
      console.log(data);
      hideModal();
      displayMessage('.new-gym');
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ add gym actions ^^

  // vv newsfeed actions vv
  $('#homepage').on('click', function (event) {
    event.preventDefault();

    var formData = new FormData(event.target);
    $.ajax({
      url: myApp.baseUrl,
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (bulletins) {
      $('.feed-header').text('New in your gyms');
      $('.content-header').text('Top stories');
      $('.content-body').empty();
      let bulletinListingTemplate = require('./handlebars/bulletins/bulletins-listing.handlebars');
      $('.content-body').append(bulletinListingTemplate({
        bulletins
        // this is passing the JSON object into the bookListingTemplate
        // where handlebars will deal with each item of the array individually
      }));
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ newsfeed actions ^^

  // vv my profile actions vv
  $('#my-profile').on('click', function (event) {
    event.preventDefault();

    var formData = new FormData(event.target);
    $.ajax({
      url: myApp.baseUrl + '/users/' + myApp.user.id,
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (data) {
      console.log(data);
      $('.site-content').hide();
      $('.user-show').show();
      $('.feed-header').text('Your profile');
      $('.content-header').text('You');
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ my profile actions ^^

  // vv all users actions vv
  $('#all-users').on('click', function (event) {
    event.preventDefault();

    $.ajax({
      url: myApp.baseUrl + '/users',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false,
    }).done(function (users) {
      $('.feed-header').text('All users');
      $('.content-header').text('Users');
      $('.content-body').empty();
      let userListingTemplate = require('./handlebars/users/users-listing.handlebars');
      $('.content-body').append(userListingTemplate({
        users
        // this is passing the JSON object into the bookListingTemplate
        // where handlebars will deal with each item of the array individually
      }));
      myApp.users = users;
      for (let i = 0; i < myApp.users.length; i++) {
        console.log(myApp.users[i]);
      }


    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ all users actions ^^

  // vv all gyms actions vv
  $('#all-gyms').on('click', function (event) {
    event.preventDefault();

    $.ajax({
      url: myApp.baseUrl + '/gyms',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false,
    }).done(function (gyms) {
      $('.feed-header').text('All gyms');
      $('.content-header').text('Gyms');
      $('.content-body').empty();
      let gymListingTemplate = require('./handlebars/gyms/gyms-listing.handlebars');
      $('.content-body').append(gymListingTemplate({
        gyms
        // this is passing the JSON object into the bookListingTemplate
        // where handlebars will deal with each item of the array individually
      }));
      myApp.gyms = gyms;

    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ all gyms actions ^^

  // vv visit single gym actions vv
  $('.content-body').on('click', 'button', function (event) {
    event.preventDefault();
    $.ajax({
      url: myApp.baseUrl + '/gyms/' + $(this).data("gym-id"),
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false
    }).done(function (single_gym) {
      myApp.gym = single_gym;
      console.log(single_gym);
      $('.feed-header').text(myApp.gym.name);
      $('.content-header').text('The latest:');
      $('.content-body').empty();
      let bulletinsListingTemplate = require('./handlebars/bulletins/bulletins-listing.handlebars');
      $('.content-body').append(bulletinsListingTemplate({
        single_gym
        // this is passing the JSON object into the bookListingTemplate
        // where handlebars will deal with each item of the array individually
      }));

    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ visit single gym actions ^^

  // vv sign out actions vv
  $('#sign-out').on('click', function (event) {
    event.preventDefault();

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
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ sign out actions ^^

});
