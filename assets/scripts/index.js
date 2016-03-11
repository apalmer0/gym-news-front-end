'use strict';

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// use require without a reference to ensure a file is bundled
require('./example');
let authentication = require('./authentication');
let ajax = require('./ajax');
let pageSetup = require('./page-setup');
let pageChanges = require('./page-changes');
let globalVariables = require('./global-variables');
require('./climbs');

// load sass manifest
require('../styles/index.scss');


$(document).ready(() => {

  // hides all page elements that need to appear at specific points.
  pageSetup.hidePageElements();

  // make sure the appropriate page elements are displayed
  // based on whether or not you're logged in
  if (!globalVariables.myApp.user) {
    pageSetup.toggleLoggedOut();
  } else {
    pageSetup.toggleLoggedIn();
  }

  // miscellaneous; causes the navbar to collapse
  // when you click a button in an overlaying modal
  $('.modal-button').on('click', function () {
    $('.navbar-collapse').removeClass('in');
  });

// add a new climb
  $('#add-new-climb-form').submit(function (event) {
    event.preventDefault();
    console.log('starting new climb addition');
    var formData = new FormData(event.target);
    let gymId = $('.new-climbs-button')[0].dataset.gymId;
    $.ajax({
      url: globalVariables.myApp.baseUrl + '/gyms/'+ gymId + '/climbs',
      headers: {
        Authorization: 'Token token=' + globalVariables.myApp.user.token,
      },
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (data) {
      console.log(data);
      console.log('climbs added!');
      pageChanges.displayMessage('.new-climbs');
      pageChanges.hideModal();
      $('.add-climbs').remove();
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // vvvv open edit climb menu vvvv
  $('.content-body').on('click', 'div.climb-square', function(event) {
    event.preventDefault();
    $("#editClimbModal").modal("show");
    console.log('opening edit menu!');
    let climbId = $(this)[0].dataset.editClimbId;
    $('.submit-climb-edits-button').attr('data-climb-id', climbId);
    $.ajax({
      url: globalVariables.myApp.baseUrl + '/climbs/' + climbId,
      headers: {
        Authorization: 'Token token=' + globalVariables.myApp.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false
    }).done(function (single_climb) {
      console.log(single_climb);
      $('.edit-climb-pane').empty();
      let editClimbTemplate = require('./handlebars/climbs/edit-climb.handlebars');
      $('.edit-climb-pane').append(editClimbTemplate(single_climb));
      console.log('editing climb no '+climbId);
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^^^ open edit climb menu

  // vvv edit climb vvv
  $('#edit-climb-form').on('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    let climbId = $('.submit-climb-edits-button')[0].dataset.climbId;
    console.log(event.target);
    $.ajax({
      url: globalVariables.myApp.baseUrl + '/climbs/' + climbId,
      headers: {
        Authorization: 'Token token=' + globalVariables.myApp.user.token,
      },
      method: 'PATCH',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (data) {
      console.log(data);
      pageChanges.displayMessage('.climb-edited');
      pageChanges.hideModal();
      $("#editClimbModal").modal("hide");
      // getGymsBulletins(globalVariables.myApp.)
      ajax.showNewsfeed(event);
      $('.edit-climb-pane').empty();
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^^^ edit climb ^^^^


 // favorite climbs
 $('.content-body').on('click', 'button.favorite-climb-button', function() {
   event.preventDefault();
   let userId = globalVariables.myApp.user.id;
   let climbId = $(this)[0].dataset.favoriteClimbId;
   let favoriteData = { "user_id": userId, "climb_id": parseInt(climbId) };
   $.ajax({
     url: globalVariables.myApp.baseUrl + '/favorites',
     headers: {
       Authorization: 'Token token=' + globalVariables.myApp.user.token,
     },
     method: 'POST',
     contentType: "application/json",
     processData: false,
     data: JSON.stringify(favoriteData)
   }).done(function (data) {
     console.log(data);
     pageChanges.displayMessage('.climb-favorited');
   }).fail(function (jqxhr) {
     console.error(jqxhr);
   });
 });

  // vv signup actions vv
  $('.sign-up').on('submit', function (event) {
    authentication.signUp(event);
  });

  // vv signin actions vv
  $('.sign-in').on('submit', function (event) {
    authentication.signIn(event);
  });

  // vv signOut actions vv
  $('#sign-out').on('click', function (event) {
    authentication.signOut(event);
  });

  // vv change password actions vv
  $('#change-pw').on('submit', function (event) {
    authentication.changePassword(event);
  });

  // vv add gym actions vv
  $('#new-gym').on('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    $.ajax({
      url: globalVariables.myApp.baseUrl + '/gyms',
      headers: {
        Authorization: 'Token token=' + globalVariables.myApp.user.token,
      },
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData
    }).done(function (data) {
      console.log(data);
      pageChanges.hideModal();
      pageChanges.displayMessage('.new-gym');
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ add gym actions ^^

  // vv newsfeed actions vv
  $('#homepage').on('click', function (event) {
    ajax.showNewsfeed(event);
  });

  // ^^ newsfeed actions ^^

  // vv my profile actions vv
  $('#my-profile').on('click', function (event) {
    event.preventDefault();

    var formData = new FormData(event.target);
    $.ajax({
      url: globalVariables.myApp.baseUrl + '/users/' + globalVariables.myApp.user.id,
      headers: {
        Authorization: 'Token token=' + globalVariables.myApp.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (data) {
      console.log(data);
      // $('.site-content').hide();
      // $('.user-show').show();
      $('.content-body').empty();
      $('.action-items').empty();
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
      url: globalVariables.myApp.baseUrl + '/users',
      headers: {
        Authorization: 'Token token=' + globalVariables.myApp.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false,
    }).done(function (users) {
      $('.feed-header').text('All users');
      $('.content-header').text('Users');
      $('.content-body').empty();
      $('.action-items').empty();
      let userListingTemplate = require('./handlebars/users/users-listing.handlebars');
      $('.content-body').append(userListingTemplate({
        users
        // this is passing the JSON object into the bookListingTemplate
        // where handlebars will deal with each item of the array individually
      }));
      globalVariables.myApp.users = users;

    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ all users actions ^^

  // vv all gyms actions vv
  $('#all-gyms').on('click', function (event) {
    event.preventDefault();

    $.ajax({
      url: globalVariables.myApp.baseUrl + '/gyms',
      headers: {
        Authorization: 'Token token=' + globalVariables.myApp.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false,
    }).done(function (gyms) {
      if (gyms.count !== 0) {
        $('.feed-header').text('All gyms');
        $('.content-header').text('Gyms');
        $('.content-body').empty();
        $('.action-items').empty();
        let gymListingTemplate = require('./handlebars/gyms/gyms-listing.handlebars');
        $('.content-body').append(gymListingTemplate({
          gyms
          // this is passing the JSON object into the bookListingTemplate
          // where handlebars will deal with each item of the array individually
        }));
        // globalVariables.myApp.gyms = gyms;
      } else {
        $('.feed-header').text('All gyms');
        $('.content-header').text('No gyms found.');
        $('.content-body').empty();
      }
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ all gyms actions ^^

  // vvvv create the new bulletin FORM (not the actual bulletin) vvvv
  // when a user clicks the 'add bulletin' button, this function
  // then appends the gym id to the submit button of the
  // ensuing new-climbs list in the bulletin modal
  $('.action-items').on('click', 'button', function() {
    if ($(this).hasClass('new-bulletin-button')) {
      let gymId = $(this)[0].dataset.gymId;
      $('.new-bulletin-list').empty();
      let newBulletinTemplate = require('./handlebars/bulletins/new-bulletin.handlebars');
      $('.new-bulletin-list').append(newBulletinTemplate({gymId}));
      $('.new-climbs-button').attr('data-gym-id', ($(this)[0].dataset.gymId));
      $('.new-bulletin-button').attr('data-gym-id', ($(this)[0].dataset.gymId));
    }
  });

  // ^^^^ create the new bulletin FORM (not the actual bulletin) ^^^^

  // vvvv here's where we actually create the bulletin. sweet. vvvv
  $('#new-bulletin-form').on('submit', function(event) {
    event.preventDefault();
    let gymId = parseInt($('.new-bulletin-button')[0].dataset.gymId);
    var formData = new FormData(event.target);
    $.ajax({
      url: globalVariables.myApp.baseUrl + '/gyms/' + gymId + '/bulletins',
      headers: {
        Authorization: 'Token token=' + globalVariables.myApp.user.token,
      },
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData
    }).done(function (data) {
      $('.inputClimbBulletinId').val(data.id);
      if ($('.new-climbs-list').children().length !== 0){
        $('#add-new-climb-form').trigger('submit');
      }
      pageChanges.hideModal();
      for (let i = 0; i < globalVariables.myApp.gyms.length; i++) {
        if (globalVariables.myApp.gyms[i].id === gymId) {
          ajax.getGymsBulletins(globalVariables.myApp.gyms[i]);
        }
      }
      pageChanges.displayMessage('.bulletin-created');
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^^^ here's where we actually create the bulletin. sweet. ^^^^

  // vv visit single gym/user actions vv
  $('.content-body').on('click', 'button.visit-single-resource', function (event) {
    event.preventDefault();
    if ($(this).hasClass('visit-user') || $(this).hasClass('visit-gym')) {
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
        url: globalVariables.myApp.baseUrl + path,
        headers: {
          Authorization: 'Token token=' + globalVariables.myApp.user.token,
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
          globalVariables.myApp.gym = single_entity;
          $('.feed-header').text(globalVariables.myApp.gym.name);
          $('.content-header').text('The latest');
          $('.action-items').empty();
          let bulletinButtonTemplate = require('./handlebars/bulletins/bulletin-button.handlebars');
          $('.action-items').append(bulletinButtonTemplate(single_entity));
          ajax.getGymsBulletins(single_entity);
        // users below
        } else if (targetResource === '/users/') {
          globalVariables.myApp.visited_user = single_entity;
          console.log(single_entity);
          $('.feed-header').text(globalVariables.myApp.visited_user.email);
          $('.content-header').text(globalVariables.myApp.visited_user.email);
          $('.content-body').empty();
          // let bulletinsListingTemplate = require('./handlebars/bulletins/bulletins-listing.handlebars');
          // $('.content-body').append(bulletinsListingTemplate({
          //   single_entity
          //   // this is passing the JSON object into the bookListingTemplate
          //   // where handlebars will deal with each item of the array individually
          // }));
        // anything else... i have no idea what would trigger this.
        } else {
          $('.feed-header').text('error');
          console.log('error');
        }

      }).fail(function (jqxhr) {
        console.error(jqxhr);
      });
    }
  });

  // ^^ visit single gym/user actions ^^

  // vvvv delete single climb actions vvvv
  $('.content-body').on('click', 'button.delete-climb-button', function() {
    event.preventDefault();
    let climbId = $(this)[0].dataset.deleteClimbId;
    console.log(climbId);
    $.ajax({
      url: globalVariables.myApp.baseUrl + '/climbs/' + climbId,
      headers: {
        Authorization: 'Token token=' + globalVariables.myApp.user.token,
      },
      method: 'DELETE',
      contentType: false,
      processData: false
    }).done(function () {
      console.log('deleting climb no '+climbId);
      $('.climbNumber'+climbId).remove();
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^^^ delete single climb actions


});
