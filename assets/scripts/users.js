'use strict';

let globalVariables = require('./global-variables');

let getAllUsers = function getAllUsers (event) {
  event.preventDefault();
  console.log('get all users');
  $.ajax({
    url: globalVariables.baseUrl + '/users',
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    method: 'GET',
    contentType: false,
    processData: false,
  }).done(function (usersObject) {
    console.log('all users:');
    console.log(usersObject);

    // for heroku:
    // globalVariables.users = usersObject.users;
    // let allUsers = usersObject.users;

    // for localhost:
    globalVariables.users = usersObject;
    let allUsers = usersObject;

    $('.feed-header').text('All users');
    $('.content-header').text('Users');
    $('.content-body').empty();
    $('.action-items').empty();
    let userListingTemplate = require('./handlebars/users/users-listing.handlebars');
    $('.content-body').append(userListingTemplate({
      allUsers
      // this is passing the JSON object into the bookListingTemplate
      // where handlebars will deal with each item of the array individually
    }));

  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

let getMyProfile = function getMyProfile(event) {
  event.preventDefault();
  console.log('get my profile');
  var formData = new FormData(event.target);
  $.ajax({
    url: globalVariables.baseUrl + '/users/' + globalVariables.user.id,
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    method: 'GET',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function (userData) {
    console.log('my profile success');
    console.log(userData);
    globalVariables.me = userData.user;
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
