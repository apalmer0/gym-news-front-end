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
  console.log(localStorage.User);

  // if(localStorage.getItem('User')) {
  //   myApp.user = localStorage.getItem('User');
  //   $('.site-content').hide();
  //   $('.user-show').hide();
  //   $('.homepage').show();
  // }

  // localStorage.setItem('User', JSON.stringify(user));
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
    $('.new-climbs').hide();
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

  $('.action-items').on('click', 'button', function() {
    if ($(this).hasClass('new-climb-button')) {
      console.log('hi');
      console.log($(this)[0].dataset.gymId);
      $('.new-climbs-button').attr('data-gym-id', ($(this)[0].dataset.gymId));
    }
  });

  let color = "";
  let type = "";
  let grade = "";
  let modifier = "";
  let climbNumber = 0;

  $('.color-options').on('click', 'div', function () {
    climbNumber++;
    color = $(this)[0].dataset.colorId;
    if ($(this).hasClass('create-active')) {
      $('.new-climb-square').removeClass('create-active');
      $('.new-climb-square').addClass('inactive');
      $('.type-square').removeClass('inactive');
      $('.type-square').addClass('create-active');
      $('.grade-square').addClass('inactive');
      $('.grade-square').removeClass('create-active');
      $('.modifier-square').addClass('inactive');
      $('.modifier-square').removeClass('create-active');
      let newClimbTemplate = require('./handlebars/climbs/new-climb.handlebars');
      $('.new-climbs-list').append(newClimbTemplate({climbNumber}));
      $('.new-climb-preview-square').last().addClass('bk-'+color);
      $('.inputClimbColor').last().val(color);
      let gymId = $('.new-climbs-button')[0].dataset.gymId;
      $('.inputClimbGym').last().val(gymId);
    }
  });

  $('.new-climbs-list').on('click', 'div', function() {
    $('.climbNumber'+$(this)[0].dataset.climbId).remove();
  });

  $('.clear-climbs').on('click', function() {
    $('.add-climbs').remove();
  });

  $('.type-square').on('click', function () {
    if ($(this).hasClass('create-active')) {
      $('.new-climb-preview-square').last().empty();
      $('.grade-square').addClass('create-active');
      $('.grade-square').removeClass('inactive');
      type = $(this)[0].dataset.typeId;
      $('.new-climb-preview-square').last().append(document.createTextNode(type));
      $('.inputClimbClimb_Type').last().val(type);
    }
  });

  $('.grade-square').on('click', function () {
    if ($(this).hasClass('create-active')) {
      $('.new-climb-preview-square').last().empty();
      $('.modifier-square').addClass('create-active');
      $('.modifier-square').removeClass('inactive');
      $('.new-climb-square').addClass('create-active');
      $('.new-climb-square').removeClass('inactive');
      $('.climbs-count').text($('.new-climb-preview-square').length);
      grade = $(this)[0].dataset.gradeId;
      $('.new-climb-preview-square').last().append(document.createTextNode(type+grade));
      $('.inputClimbGrade').last().val(grade);
    }
  });

  $('.modifier-square').on('click', function () {
    if ($(this).hasClass('create-active')) {
      $('.modifier-square').removeClass('create-active');
      $('.modifier-square').addClass('inactive');
      $('.new-climb-preview-square').last().empty();
      modifier = $(this)[0].dataset.modifierId;
      $('.new-climb-preview-square').last().append(document.createTextNode(type+grade+modifier));
      $('.inputClimbModifier').last().val(modifier);
    }
  });

  $('#add-new-climb-form').on('submit', function (event) {
    event.preventDefault();
    console.log('starting new climb addition');
    var formData = new FormData(event.target);
    let gymId = $('.new-climbs-button')[0].dataset.gymId;
    $.ajax({
      url: myApp.baseUrl + '/gyms/'+ gymId + '/climbs',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (data) {
      console.log(data);
      console.log('climbs added!');
      displayMessage('.new-climbs');
      hideModal();
      $('.add-climbs').remove();
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
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
      localStorage.setItem('User', JSON.stringify(user));
      myApp.user = user;
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

  // vvvv populate all gym climbs vvvv
  let allGymClimbs = function allGymClimbs(gym) {
    console.log('lets get all climbs');
    $.ajax({
      url: myApp.baseUrl + '/gyms/' + gym.id + '/climbs',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false
    }).done(function (climbs) {
      console.log('you should be seeing a lot of climbs now...');
      $('.content-body').empty();
      let climbListingTemplate = require('./handlebars/climbs/climbs-listing.handlebars');
      $('.content-body').append(climbListingTemplate({
        climbs
      }));
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  };

  // ^^^^ populate all gym climbs ^^^^

  // vv visit single gym/user actions vv
  $('.content-body').on('click', 'button', function (event) {
    event.preventDefault();
    let targetClass = event.target.className;
    // the event target is the button that got clicked. this pulls in the class name
    // from the clicked button, bc otherwise every button is the same
    let targetResource = (targetClass.indexOf('visit-gym') > -1) ? '/gyms/' : '/users/';
    // this looks at the class and determines if it includes the string 'visit-gym'
    // and returns a string parsed as a url path for either gyms or users.
    // this doesn't account for any edge cases and will likely need to be improved.
    let destination = event.target.dataset.linkId;
    // this looks up the data element of the button, which is the target user/gym's id
    let path;
    if (targetResource === '/gyms/') {
      path = '/gyms/' + destination;
    } else if (targetResource === '/users/') {
      path = '/users/' + destination;
    } else {
      path = '';
    }
    $.ajax({
      url: myApp.baseUrl + path,
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false
    }).done(function (single_entity) {
      console.log('returning a single entity');
      // this ajax call will return a single entity, be it a gym or user
      console.log(single_entity);
      // gyms below
      if (targetResource === '/gyms/') {
        myApp.gym = single_entity;
        $('.feed-header').text(myApp.gym.name);
        let buttonTemplate = require('./handlebars/gyms/gym-button.handlebars');
        $('.action-items').empty();
        $('.action-items').append(buttonTemplate(single_entity));
        allGymClimbs(single_entity);
      // users below
      } else if (targetResource === '/users/') {
        myApp.visited_user = single_entity;
        console.log(single_entity);
        $('.feed-header').text(myApp.visited_user.email);
        $('.content-header').text(myApp.visited_user.email);
      // anything else... i have no idea what would trigger this.
      } else {
        $('.feed-header').text('error');
      }
      // $('.content-body').empty();
      // let bulletinsListingTemplate = require('./handlebars/bulletins/bulletins-listing.handlebars');
      // $('.content-body').append(bulletinsListingTemplate({
      //   single_entity
      //   // this is passing the JSON object into the bookListingTemplate
      //   // where handlebars will deal with each item of the array individually
      // }));

    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ visit single gym/user actions ^^


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
