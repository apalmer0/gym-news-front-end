'use strict';

let climbVariables = require('./climb-variables.js');

$('.edit-color-options').on('click', 'div', function () {
  climbVariables.color = $(this)[0].dataset.colorId;
  $('.edit-climb-square-preview').removeClass (function (index, css) {
     return (css.match (/(^|\s)bk-\S+/g) || []).join(' ');
  });
  $('.edit-climb-square-preview').addClass('bk-'+climbVariables.color);
  $('.editInputClimbColor').val(climbVariables.color);
});

$('.edit-type-options').on('click', 'div', function () {
  $('.edit-climb-square-preview').empty();
  climbVariables.type = $(this)[0].dataset.typeId;
  console.log(climbVariables.type);
  $('.edit-climb-square-preview').append(document.createTextNode(climbVariables.type));
  $('.editInputClimbClimb_Type').val(climbVariables.type);
});

$('.edit-grade-options').on('click', 'div', function () {
  $('.edit-climb-square-preview').empty();
  climbVariables.grade = $(this)[0].dataset.gradeId;
  console.log(climbVariables.grade);
  $('.edit-climb-square-preview').append(document.createTextNode(climbVariables.type+climbVariables.grade));
  $('.editInputClimbGrade').val(climbVariables.grade);
});

$('.edit-modifier-options').on('click', 'div', function () {
  $('.edit-climb-square-preview').empty();
  climbVariables.modifier = $(this)[0].dataset.modifierId;
  console.log(climbVariables.modifier);
  $('.edit-climb-square-preview').append(document.createTextNode(climbVariables.type+climbVariables.grade+climbVariables.modifier));
  $('.editInputClimbModifier').val(climbVariables.modifier);
});


module.exports = true;
