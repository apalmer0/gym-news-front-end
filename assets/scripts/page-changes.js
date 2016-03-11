'use strict';


var hideModal = function hideModal() {
  $('.modal').hide();
  $('.modal').removeClass('in');
  $('.modal').attr('style','display: none;');
  $('.modal-backdrop').hide();
  $('body').removeClass('modal-open');
};

var displayMessage = function displayMessage(type) {
  $(function () {
    $(type).delay(50).fadeIn('normal', function () {
      $(this).delay(2000).fadeOut();
    });
  });
};


module.exports = {
  hideModal,
  displayMessage
};
