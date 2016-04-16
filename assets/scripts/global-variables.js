'use strict';

const myApp = {
  baseUrl: document.location.hostname === 'localhost' ?
    'http://localhost:3000' :
    'https://fathomless-castle-93150.herokuapp.com'
};

module.exports = {
  myApp
};
