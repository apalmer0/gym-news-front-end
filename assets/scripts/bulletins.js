'use strict';

let globalVariables = require('./global-variables');
let ajax = require('./ajax');
let pageChanges = require('./page-changes');


// vvvv create the new bulletin FORM (not the actual bulletin) vvvv
// when a user clicks the 'add bulletin' button, this function
// then appends the gym id to the submit button of the
// ensuing new-climbs list in the bulletin modal
let setUpNewBulletinForm = function setUpNewBulletinForm() {
  if ($(this).hasClass('new-bulletin-button')) {
    let gymId = $(this)[0].dataset.gymId;
    $('.new-bulletin-list').empty();
    let newBulletinTemplate = require('./handlebars/bulletins/new-bulletin.handlebars');
    $('.new-bulletin-list').append(newBulletinTemplate({gymId}));
    $('.new-climbs-button').attr('data-gym-id', ($(this)[0].dataset.gymId));
    $('.new-bulletin-button').attr('data-gym-id', ($(this)[0].dataset.gymId));
  }
};

let createNewBulletin = function createNewBulletin(event) {
  event.preventDefault();
  let gymId = parseInt($('.new-bulletin-button')[0].dataset.gymId);
  var formData = new FormData(event.target);
  $.ajax({
    url: globalVariables.baseUrl + '/gyms/' + gymId + '/bulletins',
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
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
    for (let i = 0; i < globalVariables.gyms.length; i++) {
      if (globalVariables.gyms[i].id === gymId) {
        ajax.getGymsBulletins(globalVariables.gyms[i]);
      }
    }
    pageChanges.displayMessage('.bulletin-created');
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

module.exports = {
  setUpNewBulletinForm,
  createNewBulletin
};
