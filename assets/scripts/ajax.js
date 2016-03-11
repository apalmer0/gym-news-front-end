'use strict';

let globalVariables = require('./global-variables');

let setGyms = function setGyms() {
  globalVariables.myApp.gyms = [];
  $.ajax({
    url: globalVariables.myApp.baseUrl + '/gyms/2',
    headers: {
      Authorization: 'Token token=' + globalVariables.myApp.user.token,
    },
    method: 'GET',
    contentType: false,
    processData: false,
  }).done(function (gym) {
    console.log('success');
    globalVariables.myApp.gyms.push(gym);
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

let showBulletinsWithClimbs = function showBulletinsWithClimbs(bulletins) {
  let bulletinListingTemplate = require('./handlebars/bulletins/bulletins-listing.handlebars');
  $('.content-body').append(bulletinListingTemplate({
    bulletins
  }));
  for (let i = 0; i < $('.bulletin-climbs-list').length; i++) {
    for (let j = 0; j < globalVariables.myApp.climbs.length; j++) {
      if (Number(globalVariables.myApp.climbs[j].bulletin_id) === Number($('.bulletin-climbs-list')[i].dataset.bulletinId)) {
        $('.bulletin'+$('.bulletin-climbs-list')[i].dataset.bulletinId).append("<div class='climb-square bk-"+globalVariables.myApp.climbs[j].color+"' data-edit-climb-id="+globalVariables.myApp.climbs[j].id+">" + globalVariables.myApp.climbs[j].climb_type + globalVariables.myApp.climbs[j].grade + globalVariables.myApp.climbs[j].modifier + '</div>');
        // $('.bulletin'+$('.bulletin-climbs-list')[i].dataset.bulletinId).attr('data-climb-id', myApp.climbs[j].id);
      }
    }
  }
};

// vvv show newsfeed vvv
let showNewsfeed = function showNewsfeed(event) {
  event.preventDefault();
  $.ajax({
    url: globalVariables.myApp.baseUrl + '/gyms/' + 2 + '/bulletins',
    headers: {
      Authorization: 'Token token=' + globalVariables.myApp.user.token,
    },
    method: 'GET',
    contentType: false,
    processData: false,
  }).done(function (bulletins) {
    $('.feed-header').text('New in your gyms');
    $('.content-header').text('Top stories');
    $('.content-body').empty();
    $('.action-items').empty();
    getGymsBulletins(globalVariables.myApp.gyms[0]);
  }).fail(function (jqxhr) {
    $('.feed-header').text('New in your gyms');
    $('.content-header').text('You\'re not following any gyms yet!');
    $('.content-body').empty();
    $('.action-items').empty();
    console.error(jqxhr);
  });
};

// vvv get all bulletins for a single gym vvv
let getGymsBulletins = function getGymsBulletins(single_gym) {
  $.ajax({
    url: globalVariables.myApp.baseUrl + '/gyms/' + single_gym.id + '/climbs',
    headers: {
      Authorization: 'Token token=' + globalVariables.myApp.user.token,
    },
    method: 'GET',
    contentType: false,
    processData: false,
  }).done(function (climbs) {
    globalVariables.myApp.climbs = climbs;
    $.ajax({
      url: globalVariables.myApp.baseUrl + '/gyms/' + single_gym.id + '/bulletins',
      headers: {
        Authorization: 'Token token=' + globalVariables.myApp.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false,
    }).done(function (bulletins) {
      $('.content-body').empty();
      showBulletinsWithClimbs(bulletins);
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

// ^^^^ get all bulletins for a single gym ^^^^


module.exports = {
  setGyms,
  showNewsfeed,
  getGymsBulletins
};
