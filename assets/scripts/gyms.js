'use strict';

let globalVariables = require('./global-variables');
let pageChanges = require('./page-changes');

let getAllGyms = function getAllGyms (event) {
  event.preventDefault();
  console.log('get all gyms');
  $.ajax({
    url: globalVariables.baseUrl + '/gyms',
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    method: 'GET',
    contentType: false,
    processData: false,
  }).done(function (gymsObject) {
    console.log(gymsObject);

      // for heroku:
      // globalVariables.gyms = gymsObject.gyms;
      // let allGyms = gymsObject.gyms;
    // if (gymsObject.gyms.count !== 0) {

      // for localhost:
      globalVariables.gyms = gymsObject;
      let allGyms = gymsObject;
    if (gymsObject.count !== 0) {
      $('.feed-header').text('All gyms');
      $('.content-header').text('Gyms');
      $('.content-body').empty();
      $('.action-items').empty();
      let gymListingTemplate = require('./handlebars/gyms/gyms-listing.handlebars');
      $('.content-body').append(gymListingTemplate({
        allGyms
        // this is passing the JSON object into the gymListingTemplate
        // where handlebars will deal with each item of the array individually
      }));
    } else {
      $('.feed-header').text('All gyms');
      $('.content-header').text('No gyms found.');
      $('.content-body').empty();
    }
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

// ^^ all gyms actions ^^

let createNewGym = function createNewGym(event) {
  event.preventDefault();
  console.log('creating new gym...');
  var formData = new FormData(event.target);
  $.ajax({
    url: globalVariables.baseUrl + '/gyms',
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    method: 'POST',
    contentType: false,
    processData: false,
    data: formData
  }).done(function (data) {
    console.log('new gym created!');
    console.log(data);
    pageChanges.hideModal();
    pageChanges.displayMessage('.new-gym');
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

module.exports = {
  getAllGyms,
  createNewGym
};
