'use strict';

let climbVariables = require('./climb-variables.js');
let climbNumber = 0;

$('.color-options').on('click', 'div', function () {
  climbNumber++;
  climbVariables.color = $(this)[0].dataset.colorId;
  if ($(this).hasClass('create-active')) {
    $('.new-climb-square').removeClass('create-active');
    $('.new-climb-square').addClass('inactive');
    $('.type-square').removeClass('inactive');
    $('.type-square').addClass('create-active');
    $('.grade-square').addClass('inactive');
    $('.grade-square').removeClass('create-active');
    $('.modifier-square').addClass('inactive');
    $('.modifier-square').removeClass('create-active');
    let newClimbTemplate = require('./handlebars/climbs/new-climb.handlebars');
    $('.new-climbs-list').append(newClimbTemplate({climbNumber}));
    $('.new-climb-preview-square').last().addClass('bk-'+climbVariables.color);
    $('.edit-climb-square-preview').addClass('bk-'+climbVariables.color);
    $('.inputClimbColor').last().val(climbVariables.color);
    let gymId = $('.new-climbs-button')[0].dataset.gymId;
    $('.inputClimbGym').last().val(gymId);
  }
});

$('.new-climbs-list').on('click', 'div', function() {
  $('.climbNumber'+$(this)[0].dataset.climbId).remove();
});

$('.clear-climbs').on('click', function() {
  $('.add-climbs').remove();
});

$('.type-square').on('click', function () {
  if ($(this).hasClass('create-active')) {
    $('.new-climb-preview-square').last().empty();
    $('.grade-square').addClass('create-active');
    $('.grade-square').removeClass('inactive');
    climbVariables.type = $(this)[0].dataset.typeId;
    $('.new-climb-preview-square').last().append(document.createTextNode(climbVariables.type));
    $('.inputClimbClimb_Type').last().val(climbVariables.type);
  }
});

$('.grade-square').on('click', function () {
  if ($(this).hasClass('create-active')) {
    $('.new-climb-preview-square').last().empty();
    $('.modifier-square').addClass('create-active');
    $('.modifier-square').removeClass('inactive');
    $('.new-climb-square').addClass('create-active');
    $('.new-climb-square').removeClass('inactive');
    $('.climbs-count').text($('.new-climb-preview-square').length);
    climbVariables.grade = $(this)[0].dataset.gradeId;
    $('.new-climb-preview-square').last().append(document.createTextNode(climbVariables.type+climbVariables.grade));
    $('.inputClimbGrade').last().val(climbVariables.grade);
  }
});

$('.modifier-square').on('click', function () {
  if ($(this).hasClass('create-active')) {
    $('.modifier-square').removeClass('create-active');
    $('.modifier-square').addClass('inactive');
    $('.new-climb-preview-square').last().empty();
    climbVariables.modifier = $(this)[0].dataset.modifierId;
    $('.new-climb-preview-square').last().append(document.createTextNode(climbVariables.type+climbVariables.grade+climbVariables.modifier));
    $('.inputClimbModifier').last().val(climbVariables.modifier);
  }
});


module.exports = true;
