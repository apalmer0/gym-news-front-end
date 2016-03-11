'use strict';

let globalVariables = require('./global-variables');

let getAllUsers = function getAllUsers (event) {
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
};

let getMyProfile = function getMyProfile(event) {
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
    $('.content-body').empty();
    $('.action-items').empty();
    $('.feed-header').text('Your profile');
    $('.content-header').text('You');
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

module.exports = {
  getAllUsers,
  getMyProfile
};
