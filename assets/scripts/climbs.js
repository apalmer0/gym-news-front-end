'use strict';

let globalVariables = require('./global-variables');
let pageChanges = require('./page-changes');
let ajax = require('./ajax');

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

let openEditClimbModal = function openEditClimbModal(event) {
  event.preventDefault();
  $("#editClimbModal").modal("show");
  console.log('opening edit menu!');
  let climbId = event.target.dataset.editClimbId;
  $('.delete-climb-button').attr('data-delete-climb-id', climbId);
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
};

let submitClimbEdit = function submitClimbEdit(event) {
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
    ajax.showNewsfeed(event);
    $('.edit-climb-pane').empty();
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

let deleteClimb = function deleteClimb(event) {
  event.preventDefault();
  let climbId = event.target.dataset.deleteClimbId;
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
    pageChanges.hideModal();
    pageChanges.displayMessage('.climb-deleted');
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

module.exports = {
  addFavoriteClimb,
  addNewClimbs,
  openEditClimbModal,
  submitClimbEdit,
  deleteClimb
};
