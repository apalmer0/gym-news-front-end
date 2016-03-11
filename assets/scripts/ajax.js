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
        $('.bulletin'+$('.bulletin-climbs-list')[i].dataset.bulletinId).append("<div class='climb-square bk-"+globalVariables.myApp.climbs[j].color+" climbNumber"+globalVariables.myApp.climbs[j].id+"' data-edit-climb-id="+globalVariables.myApp.climbs[j].id+">" + globalVariables.myApp.climbs[j].climb_type + globalVariables.myApp.climbs[j].grade + globalVariables.myApp.climbs[j].modifier + '</div>');
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

let getSingleUserOrGym = function getSingleUserOrGym (event) {
  event.preventDefault();
  console.log('getting single resource');
  if (event.target.className.indexOf('visit-gym') > -1 || event.target.className.indexOf('visit-user') > -1 ) {
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
        getGymsBulletins(single_entity);
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
};

module.exports = {
  setGyms,
  showNewsfeed,
  getGymsBulletins,
  getSingleUserOrGym
};
