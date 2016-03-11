'use strict';

let globalVariables = require('./global-variables');
let pageChanges = require('./page-changes');

require('./create-climb');
require('./edit-climb');

let addFavoriteClimb = function addFavoriteClimb(event) {
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
};

let addNewClimbs = function addNewClimbs(event) {
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
};

module.exports = {
  addFavoriteClimb,
  addNewClimbs
};
