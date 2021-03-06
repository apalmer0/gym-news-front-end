'use strict';

let globalVariables = require('./global-variables');

let showBulletinsWithClimbs = function showBulletinsWithClimbs(bulletins) {
  console.log('show bulletins with climbs');
  console.log('globalVariables.climbs:');
  console.log(globalVariables.climbs);
  let bulletinListingTemplate = require('./handlebars/bulletins/bulletins-listing.handlebars');
  $('.content-body').append(bulletinListingTemplate({
    bulletins
  }));
  for (let i = 0; i < $('.bulletin-climbs-list').length; i++) {
    for (let j = 0; j < globalVariables.climbs.length; j++) {
      if (Number(globalVariables.climbs[j].bulletin_id) === Number($('.bulletin-climbs-list')[i].dataset.bulletinId)) {
        $('.bulletin'+$('.bulletin-climbs-list')[i].dataset.bulletinId).append("<div class='climb-square bk-"+globalVariables.climbs[j].color+" climbNumber"+globalVariables.climbs[j].id+"' data-edit-climb-id="+globalVariables.climbs[j].id+">" + globalVariables.climbs[j].climb_type + globalVariables.climbs[j].grade + globalVariables.climbs[j].modifier + '</div>');
        // $('.bulletin'+$('.bulletin-climbs-list')[i].dataset.bulletinId).attr('data-climb-id', myApp.climbs[j].id);
      }
    }
  }
};

// vvv get all bulletins for a single gym vvv
let getGymsBulletins = function getGymsBulletins(single_gym) {
  console.log('get gym bulletins start');
  $.ajax({
    url: globalVariables.baseUrl + '/gyms/' + single_gym.id + '/climbs',
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    method: 'GET',
    contentType: false,
    processData: false,
  }).done(function (climbsObject) {
    console.log('climbsObject returned:');
    console.log(climbsObject);
    console.log('got gym climbs. now getting bulletins');

    // for heroku
    globalVariables.climbs = climbsObject.climbs;
    // for localhost
    // globalVariables.climbs = climbsObject;

    $.ajax({
      url: globalVariables.baseUrl + '/gyms/' + single_gym.id + '/bulletins',
      headers: {
        Authorization: 'Token token=' + globalVariables.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false,
    }).done(function (bulletinsObject) {
      console.log('bulletinsObject returned:');
      console.log(bulletinsObject);
      console.log('on a roll, got bulletins. now to show bulletins with climbs');
      $('.content-body').empty();

      // for heroku
      showBulletinsWithClimbs(bulletinsObject.bulletins);
      // for localhost
      // showBulletinsWithClimbs(bulletinsObject);

    }).fail(function (jqxhr) {
      console.log('didnt get bulletins, so were not going to show bulletins with climbs');
      console.error(jqxhr);
    });
  }).fail(function (jqxhr) {
    console.log('didnt get climbs, so were not going to get bulletins');
    console.error(jqxhr);
  });
};

// ^^^^ get all bulletins for a single gym ^^^^

// vvv show newsfeed vvv
let showNewsfeed = function showNewsfeed(event) {
  event.preventDefault();
  console.log('show newsfeed');
  console.log('globalVariables.gyms:');
  console.log(globalVariables.gyms);
  // you need to fix this - this is always referencing the first gym.
  if (globalVariables.gyms.length > 0) {
    $.ajax({
      url: globalVariables.baseUrl + '/gyms/' + globalVariables.gyms[0].id + '/bulletins',
      headers: {
        Authorization: 'Token token=' + globalVariables.user.token,
      },
      method: 'GET',
      contentType: false,
      processData: false,
    }).done(function () {
      $('.feed-header').text('New in your gyms');
      $('.content-header').text('Top stories');
      $('.content-body').empty();
      $('.action-items').empty();
      getGymsBulletins(globalVariables.gyms[0]);
    }).fail(function (jqxhr) {
      $('.feed-header').text('New in your gyms');
      $('.content-header').text('You\'re not following any gyms yet!');
      $('.content-body').empty();
      $('.action-items').empty();
      console.error(jqxhr);
    });
  } else {
    console.log('globalVariables.gyms was not > 0');
    $('.feed-header').text('New in your gyms');
    $('.content-header').text('No gyms found!');
  }
};

let setGyms = function setGyms() {
  console.log('set gyms');
  globalVariables.gyms = [];
  $.ajax({
    url: globalVariables.baseUrl + '/gyms',
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    method: 'GET',
    contentType: false,
    processData: false,
  }).done(function (gymsObject) {
    console.log('setgyms success');
    console.log(gymsObject);

    // for heroku
    for (let i = 0; i < gymsObject.gyms.length; i++) {
      globalVariables.gyms.push(gymsObject.gyms[i]);
      // for localhost
    // for (let i = 0; i < gymsObject.length; i++) {
    //   globalVariables.gyms.push(gymsObject[i]);

    }
    showNewsfeed(event);
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

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
      url: globalVariables.baseUrl + path,
      headers: {
        Authorization: 'Token token=' + globalVariables.user.token,
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

        globalVariables.gym = single_entity;

        let singleGym = single_entity;
        $('.feed-header').text(singleGym.name);
        $('.content-header').text('The latest');
        $('.action-items').empty();
        let bulletinButtonTemplate = require('./handlebars/bulletins/bulletin-button.handlebars');
        $('.action-items').append(bulletinButtonTemplate(singleGym));
        getGymsBulletins(singleGym);
      // users below
      } else if (targetResource === '/users/') {

        // for heroku
        globalVariables.visited_user = single_entity.user;
        let singleUser = single_entity.user;
        // for localhost
        // globalVariables.visited_user = single_entity;
        // let singleUser = single_entity;

        console.log(singleUser);
        $('.feed-header').text(singleUser.email);
        $('.content-header').text(singleUser.email);
        $('.content-body').empty();
        let userTemplate = require('./handlebars/users/one_user.handlebars');
        $('.content-body').append(userTemplate({
          singleUser
        }));
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
